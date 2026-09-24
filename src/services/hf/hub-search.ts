import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { omniHome } from '../../config/omni-home';

export const HUB_POPULAR_LIMIT = 50;

export type HubModality = 'text' | 'image' | 'video' | 'tts' | 'stt';
export type HubRuntime =
  | 'llamacpp'
  | 'vllm'
  | 'diffusion'
  | 'whisper'
  | 'tts'
  | 'unknown';

export type HubSearchHit = {
  id: string;
  pipelineTag: string;
  downloads: number;
  likes: number;
  tags: string[];
  modality: HubModality;
  runtime: HubRuntime;
  supported: boolean;
  vramMb: number;
  /** Estimated on-disk size for the default quant (Q4_K_M / fp16). */
  sizeMb: number;
  paramsB: number | null;
  sizeLabel: string;
};

export type HubSearchResult = {
  hits: HubSearchHit[];
  nextCursor: string | null;
  source: 'huggingface.co/api/models';
};

function hfHeaders(): Record<string, string> {
  const token = process.env.HF_TOKEN?.trim();
  const h: Record<string, string> = { 'User-Agent': 'ysk-omni' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export function parseLinkCursor(link: string | null | undefined): string | null {
  if (!link) return null;
  const m = link.match(/<([^>]+)>;\s*rel="next"/i);
  if (!m?.[1]) return null;
  try {
    return new URL(m[1]).searchParams.get('cursor');
  } catch {
    return null;
  }
}

/** Largest `27B` / `0.6B` token in the repo name (skips architecture like Qwen3). */
export function parseParamBillions(id: string): number | null {
  const name = String(id).split('/').pop() || String(id);
  const nums = [...name.matchAll(/(\d+(?:\.\d+)?)B(?=$|[^a-z])/gi)].map((m) =>
    Number(m[1]),
  );
  const usable = nums.filter((n) => Number.isFinite(n) && n > 0);
  if (!usable.length) return null;
  return Math.max(...usable);
}

export function estimateDiskVram(
  id: string,
  runtime: HubRuntime,
): { sizeMb: number; vramMb: number; paramsB: number | null; sizeLabel: string } {
  const paramsB = parseParamBillions(id);
  if (runtime === 'llamacpp') {
    if (!paramsB) {
      return { sizeMb: 0, vramMb: 4096, paramsB: null, sizeLabel: '' };
    }
    const sizeMb = Math.max(64, Math.round(paramsB * 580));
    const vramMb = Math.round(sizeMb * 1.12) + Math.max(384, Math.round(paramsB * 64));
    return { sizeMb, vramMb, paramsB, sizeLabel: 'Q4_K_M est.' };
  }
  if (runtime === 'vllm') {
    if (!paramsB) {
      return { sizeMb: 0, vramMb: 16000, paramsB: null, sizeLabel: '' };
    }
    const sizeMb = Math.max(256, Math.round(paramsB * 2048));
    const vramMb = Math.round(sizeMb * 1.2);
    return { sizeMb, vramMb, paramsB, sizeLabel: 'fp16 est.' };
  }
  if (runtime === 'whisper') {
    return { sizeMb: 500, vramMb: 1000, paramsB, sizeLabel: 'weights est.' };
  }
  if (runtime === 'tts') {
    return { sizeMb: 80, vramMb: 512, paramsB, sizeLabel: 'voice est.' };
  }
  if (runtime === 'diffusion') {
    const sizeMb = paramsB ? Math.round(paramsB * 2048) : 8000;
    return {
      sizeMb,
      vramMb: Math.max(4000, Math.round(sizeMb * 1.1)),
      paramsB,
      sizeLabel: 'weights est.',
    };
  }
  return { sizeMb: 0, vramMb: 0, paramsB, sizeLabel: '' };
}

export function classifyHubModel(raw: {
  id?: string;
  modelId?: string;
  pipeline_tag?: string;
  tags?: string[];
  downloads?: number;
  likes?: number;
  gguf?: { total?: number };
}): HubSearchHit {
  const id = String(raw.id || raw.modelId || '').trim();
  const tags = Array.isArray(raw.tags) ? raw.tags.map(String) : [];
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  const pipeline = String(raw.pipeline_tag || '').toLowerCase();
  const gguf = tagSet.has('gguf') || id.toLowerCase().includes('gguf');

  let modality: HubModality = 'text';
  let runtime: HubRuntime = 'unknown';

  if (
    pipeline === 'text-to-image' ||
    pipeline === 'image-to-image' ||
    tagSet.has('text-to-image')
  ) {
    modality = 'image';
    runtime = 'diffusion';
  } else if (
    pipeline === 'text-to-video' ||
    pipeline === 'image-to-video' ||
    tagSet.has('text-to-video')
  ) {
    modality = 'video';
    runtime = 'diffusion';
  } else if (
    pipeline === 'text-to-speech' ||
    pipeline === 'text-to-audio' ||
    tagSet.has('text-to-speech')
  ) {
    modality = 'tts';
    runtime = 'tts';
  } else if (
    pipeline === 'automatic-speech-recognition' ||
    tagSet.has('automatic-speech-recognition')
  ) {
    modality = 'stt';
    runtime = 'whisper';
  } else if (gguf) {
    modality = 'text';
    runtime = 'llamacpp';
  } else if (
    pipeline === 'text-generation' ||
    pipeline === 'text2text-generation' ||
    tagSet.has('text-generation')
  ) {
    modality = 'text';
    runtime = 'vllm';
  }

  const est = estimateDiskVram(id, runtime);
  const ggufTotal = Number(raw.gguf?.total);
  const sizeMb =
    runtime === 'llamacpp' && Number.isFinite(ggufTotal) && ggufTotal > 0
      ? Math.round(ggufTotal / (1024 * 1024))
      : est.sizeMb;
  const vramMb =
    runtime === 'llamacpp' && sizeMb
      ? Math.round(sizeMb * 1.12) + Math.max(384, Math.round((est.paramsB || 7) * 64))
      : est.vramMb;

  return {
    id,
    pipelineTag: raw.pipeline_tag || '',
    downloads: Number(raw.downloads) || 0,
    likes: Number(raw.likes) || 0,
    tags,
    modality,
    runtime,
    supported: runtime !== 'unknown',
    vramMb,
    sizeMb,
    paramsB: est.paramsB,
    sizeLabel: est.sizeLabel,
  };
}

export function buildHubSearchUrl(opts: {
  q?: string;
  modality?: string;
  limit?: number;
  cursor?: string;
}): string {
  const u = new URL('https://huggingface.co/api/models');
  u.searchParams.set('sort', 'downloads');
  u.searchParams.set('direction', '-1');
  const limit = Math.min(50, Math.max(1, opts.limit || 24));
  u.searchParams.set('limit', String(limit));
  const q = (opts.q || '').trim();
  if (q) u.searchParams.set('search', q);
  if (opts.cursor) u.searchParams.set('cursor', opts.cursor);
  const modality = (opts.modality || '').trim();
  if (modality === 'text') u.searchParams.set('filter', 'gguf');
  else if (modality === 'image') u.searchParams.set('pipeline_tag', 'text-to-image');
  else if (modality === 'video') u.searchParams.set('pipeline_tag', 'text-to-video');
  else if (modality === 'tts') u.searchParams.set('pipeline_tag', 'text-to-speech');
  else if (modality === 'stt') {
    u.searchParams.set('pipeline_tag', 'automatic-speech-recognition');
  } else if (!q) {
    u.searchParams.set('filter', 'gguf');
  }
  return u.toString();
}

function getJsonWithLink(url: string): Promise<{ json: unknown; link: string | null }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: hfHeaders() }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(c as Buffer));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        if ((res.statusCode || 0) >= 400) {
          reject(new Error(`HF ${res.statusCode}: ${body.slice(0, 200)}`));
          return;
        }
        try {
          const linkRaw = res.headers.link;
          const link = Array.isArray(linkRaw)
            ? linkRaw[0] || null
            : linkRaw || null;
          resolve({
            json: JSON.parse(body),
            link,
          });
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30_000, () => {
      req.destroy();
      reject(new Error('Hugging Face search timed out'));
    });
  });
}

export type PopularCache = {
  syncedAt: string;
  source: string;
  hits: HubSearchHit[];
};

export function popularCachePath(): string {
  return path.join(omniHome(), 'hub-popular.json');
}

export function loadPopularCache(): PopularCache | null {
  try {
    const raw = JSON.parse(fs.readFileSync(popularCachePath(), 'utf8')) as PopularCache;
    if (!raw || !Array.isArray(raw.hits)) return null;
    return {
      ...raw,
      hits: raw.hits.map((h) => {
        if (h.sizeMb && h.vramMb) return h;
        const est = estimateDiskVram(h.id, h.runtime);
        return {
          ...h,
          sizeMb: h.sizeMb || est.sizeMb,
          vramMb: h.vramMb || est.vramMb,
          paramsB: h.paramsB ?? est.paramsB,
          sizeLabel: h.sizeLabel || est.sizeLabel,
        };
      }),
    };
  } catch {
    return null;
  }
}

export function savePopularCache(hits: HubSearchHit[]): PopularCache {
  const file = popularCachePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const cache: PopularCache = {
    syncedAt: new Date().toISOString(),
    source: 'huggingface.co/api/models',
    hits: hits.slice(0, HUB_POPULAR_LIMIT),
  };
  fs.writeFileSync(file, JSON.stringify(cache, null, 2) + '\n', 'utf8');
  return cache;
}

export async function syncPopularGguf(): Promise<PopularCache> {
  const result = await searchHub({
    modality: 'text',
    limit: HUB_POPULAR_LIMIT,
  });
  return savePopularCache(result.hits);
}

export function keepRunnableHits(hits: HubSearchHit[]): HubSearchHit[] {
  return hits.filter((h) => Boolean(h.id) && h.supported);
}

export async function searchHub(opts: {
  q?: string;
  modality?: string;
  limit?: number;
  cursor?: string;
}): Promise<HubSearchResult> {
  const url = buildHubSearchUrl(opts);
  const { json, link } = await getJsonWithLink(url);
  const rows = Array.isArray(json) ? json : [];
  const hits = keepRunnableHits(
    rows.map((row) =>
      classifyHubModel((row || {}) as Parameters<typeof classifyHubModel>[0]),
    ),
  );
  return {
    hits,
    nextCursor: parseLinkCursor(link),
    source: 'huggingface.co/api/models',
  };
}
