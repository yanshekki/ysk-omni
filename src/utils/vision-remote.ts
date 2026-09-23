import type { CreateChatCompletionDto } from '../dto/chat.dto';
import { logger } from './logger';
import {
  assertResolvedPublicHost,
  parsePublicHttpUrl,
} from './ssrf';

export const VISION_FETCH_TIMEOUT_MS = 10_000;
export const VISION_FETCH_MAX_BYTES = 8 * 1024 * 1024;
export const VISION_FETCH_MAX_URLS = 8;

type ChatMessage = CreateChatCompletionDto['messages'][number];

export type VisionFetchImpl = (
  url: string,
  init: { signal: AbortSignal; redirect?: 'follow' | 'error' | 'manual' },
) => Promise<{
  ok: boolean;
  status: number;
  headers: { get(name: string): string | null };
  arrayBuffer(): Promise<ArrayBuffer>;
  body?: ReadableStream<Uint8Array> | null;
}>;

async function readCappedBody(
  res: {
    headers: { get(name: string): string | null };
    arrayBuffer(): Promise<ArrayBuffer>;
    body?: ReadableStream<Uint8Array> | null;
  },
  maxBytes: number,
): Promise<Buffer | null> {
  const cl = Number(res.headers.get('content-length'));
  if (Number.isFinite(cl) && cl > maxBytes) return null;
  const stream = res.body;
  if (stream && typeof stream.getReader === 'function') {
    const reader = stream.getReader();
    const chunks: Buffer[] = [];
    let n = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        n += value.byteLength;
        if (n > maxBytes) {
          await reader.cancel().catch(() => undefined);
          return null;
        }
        chunks.push(Buffer.from(value));
      }
    } catch {
      return null;
    }
    return Buffer.concat(chunks);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > maxBytes) return null;
  return buf;
}

function isHttpUrl(url: string): boolean {
  try {
    parsePublicHttpUrl(url);
    return true;
  } catch {
    return false;
  }
}

function sniffImageMime(bytes: Buffer, headerMime: string): string | null {
  const declared = headerMime.split(';')[0]!.trim().toLowerCase();
  if (declared.startsWith('image/')) return declared;
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'image/png';
  }
  if (
    bytes.length >= 6 &&
    bytes.subarray(0, 6).toString('ascii') === 'GIF87a'
  ) {
    return 'image/gif';
  }
  if (
    bytes.length >= 6 &&
    bytes.subarray(0, 6).toString('ascii') === 'GIF89a'
  ) {
    return 'image/gif';
  }
  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
    bytes.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

async function fetchAsDataUrl(
  url: string,
  opts: {
    timeoutMs: number;
    maxBytes: number;
    fetchImpl: VisionFetchImpl;
    resolveDns: boolean;
    hops?: number;
  },
): Promise<string | null> {
  let current: string;
  try {
    current = parsePublicHttpUrl(url).href;
  } catch {
    return null;
  }
  if (opts.resolveDns) {
    try {
      await assertResolvedPublicHost(new URL(current).hostname);
    } catch {
      return null;
    }
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), opts.timeoutMs);
  try {
    const res = await opts.fetchImpl(current, {
      signal: ac.signal,
      redirect: 'manual',
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      const hops = opts.hops ?? 0;
      if (!loc || hops >= 3) return null;
      const next = new URL(loc, current).href;
      return fetchAsDataUrl(next, { ...opts, hops: hops + 1 });
    }
    if (!res.ok) return null;
    const buf = await readCappedBody(res, opts.maxBytes);
    if (!buf || buf.length === 0) return null;
    const mime = sniffImageMime(buf, res.headers.get('content-type') || '');
    if (!mime) return null;
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch (err) {
    logger.warn({ err, url: url.slice(0, 120) }, 'Vision remote image fetch failed');
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function rewritePart(
  part: Record<string, unknown>,
  dataUrl: string | null,
  originalUrl: string,
): Record<string, unknown> {
  if (!dataUrl) {
    return { type: 'text', text: `[image: ${originalUrl}]` };
  }
  if (part.type === 'image' && part.source && typeof part.source === 'object') {
    return {
      type: 'image_url',
      image_url: { url: dataUrl },
    };
  }
  return {
    ...part,
    type: part.type === 'input_image' ? 'input_image' : 'image_url',
    image_url: { url: dataUrl },
  };
}

function extractHttpUrl(part: Record<string, unknown>): string | null {
  if (part.type === 'image' && part.source && typeof part.source === 'object') {
    const src = part.source as { url?: string };
    if (typeof src.url === 'string' && isHttpUrl(src.url)) return src.url;
  }
  const raw = part.image_url ?? (part.type === 'input_image' ? part.url : undefined);
  const url =
    typeof raw === 'object' && raw
      ? String((raw as { url?: string }).url || '')
      : String(raw || '');
  return isHttpUrl(url) ? url : null;
}

/**
 * Download http(s) image parts to data URLs so `--prompt-json` can send ACP images.
 * Failures stay as `[image: url]` text (same as the previous fallback).
 */
export async function inlineRemoteImageUrls(
  messages: ChatMessage[],
  opts?: {
    timeoutMs?: number;
    maxBytes?: number;
    fetchImpl?: VisionFetchImpl;
  },
): Promise<ChatMessage[]> {
  const timeoutMs = opts?.timeoutMs ?? VISION_FETCH_TIMEOUT_MS;
  const maxBytes = opts?.maxBytes ?? VISION_FETCH_MAX_BYTES;
  const usingDefaultFetch = !opts?.fetchImpl;
  const fetchImpl = opts?.fetchImpl ?? (globalThis.fetch as VisionFetchImpl);
  if (typeof fetchImpl !== 'function') return messages;

  const out: ChatMessage[] = [];
  let fetched = 0;
  for (const msg of messages) {
    if (!Array.isArray(msg.content)) {
      out.push(msg);
      continue;
    }
    const nextParts: unknown[] = [];
    for (const part of msg.content) {
      if (!part || typeof part !== 'object') {
        nextParts.push(part);
        continue;
      }
      const rec = part as Record<string, unknown>;
      const url = extractHttpUrl(rec);
      if (!url) {
        nextParts.push(part);
        continue;
      }
      if (fetched >= VISION_FETCH_MAX_URLS) {
        nextParts.push(rewritePart(rec, null, url));
        continue;
      }
      fetched += 1;
      const dataUrl = await fetchAsDataUrl(url, {
        timeoutMs,
        maxBytes,
        fetchImpl,
        resolveDns: usingDefaultFetch,
      });
      nextParts.push(rewritePart(rec, dataUrl, url));
    }
    out.push({ ...msg, content: nextParts as ChatMessage['content'] });
  }
  return out;
}
