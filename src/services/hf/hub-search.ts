import https from 'node:https';

export type HubModality = 'text' | 'image' | 'video' | 'tts' | 'stt';
export type HubRuntime =
  | 'llamacpp'
  | 'vllm'
  | 'diffusion'
  | 'whisper'
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

export function classifyHubModel(raw: {
  id?: string;
  modelId?: string;
  pipeline_tag?: string;
  tags?: string[];
  downloads?: number;
  likes?: number;
}): HubSearchHit {
  const id = String(raw.id || raw.modelId || '').trim();
  const tags = Array.isArray(raw.tags) ? raw.tags.map(String) : [];
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  const pipeline = String(raw.pipeline_tag || '').toLowerCase();
  const gguf = tagSet.has('gguf') || id.toLowerCase().includes('gguf');

  let modality: HubModality = 'text';
  let runtime: HubRuntime = 'unknown';
  let vramMb = 4096;

  if (
    pipeline === 'text-to-image' ||
    pipeline === 'image-to-image' ||
    tagSet.has('text-to-image')
  ) {
    modality = 'image';
    runtime = 'diffusion';
    vramMb = 8000;
  } else if (
    pipeline === 'text-to-video' ||
    pipeline === 'image-to-video' ||
    tagSet.has('text-to-video')
  ) {
    modality = 'video';
    runtime = 'diffusion';
    vramMb = 12000;
  } else if (
    pipeline === 'text-to-speech' ||
    pipeline === 'text-to-audio' ||
    tagSet.has('text-to-speech')
  ) {
    modality = 'tts';
    runtime = 'diffusion';
    vramMb = 4000;
  } else if (
    pipeline === 'automatic-speech-recognition' ||
    tagSet.has('automatic-speech-recognition')
  ) {
    modality = 'stt';
    runtime = 'whisper';
    vramMb = 1000;
  } else if (gguf) {
    modality = 'text';
    runtime = 'llamacpp';
    vramMb = 4096;
  } else if (
    pipeline === 'text-generation' ||
    pipeline === 'text2text-generation' ||
    tagSet.has('text-generation')
  ) {
    modality = 'text';
    runtime = 'vllm';
    vramMb = 16000;
  }

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
          resolve({
            json: JSON.parse(body),
            link: res.headers.link || null,
          });
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(20_000, () => {
      req.destroy();
      reject(new Error('Hugging Face search timed out'));
    });
  });
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
  const hits = rows
    .map((row) => classifyHubModel((row || {}) as Parameters<typeof classifyHubModel>[0]))
    .filter((h) => h.id);
  return {
    hits,
    nextCursor: parseLinkCursor(link),
    source: 'huggingface.co/api/models',
  };
}
