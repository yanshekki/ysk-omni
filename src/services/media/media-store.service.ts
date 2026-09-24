import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { createId } from '../../utils/id';
import { toPersistentApiKeyId } from '../../utils/api-key-id';
import type { MediaKind } from './providers/media-provider.interface';

export type StoredMediaAsset = {
  id: string;
  apiKeyId: string;
  kind: string;
  mime: string;
  byteSize: number;
  originalName: string | null;
  source: string;
  provider: string;
  prompt: string | null;
  createdAt: Date;
  meta?: unknown;
};

function mediaRoot(): string {
  return path.join(env.storageDir, 'media');
}

export function extForMime(mime: string): string {
  const m = String(mime || '')
    .split(';')[0]
    .trim()
    .toLowerCase();
  if (m === 'image/jpeg') return '.jpg';
  if (m === 'image/webp') return '.webp';
  if (m === 'image/gif') return '.gif';
  if (m === 'video/mp4') return '.mp4';
  if (m === 'audio/mpeg') return '.mp3';
  if (m === 'audio/wav' || m === 'audio/x-wav' || m === 'audio/wave') {
    return '.wav';
  }
  if (m === 'audio/ogg' || m === 'audio/opus') return '.ogg';
  if (m === 'audio/flac') return '.flac';
  if (m === 'audio/aac' || m === 'audio/mp4') return '.aac';
  if (m === 'video/webm') return '.webm';
  if (m === 'video/quicktime') return '.mov';
  if (m === 'text/plain') return '.txt';
  if (m === 'application/json') return '.json';
  if (m === 'application/x-subrip') return '.srt';
  if (m === 'text/vtt') return '.vtt';
  if (m.startsWith('audio/')) return '.bin';
  if (m.startsWith('image/')) return '.png';
  return '.bin';
}

export class MediaStoreService {
  async ensureDir(): Promise<void> {
    await fs.mkdir(mediaRoot(), { recursive: true });
  }

  async save(input: {
    apiKeyId: string;
    kind: MediaKind;
    mime: string;
    bytes: Buffer;
    originalName?: string;
    source?: string;
    provider?: string;
    prompt?: string;
    meta?: unknown;
  }): Promise<StoredMediaAsset> {
    const owner = await toPersistentApiKeyId(input.apiKeyId);
    await this.ensureDir();

    const id = createId();
    const ext = extForMime(input.mime);
    const rel = path.join(id.slice(0, 2), `${id}${ext}`);
    const full = path.join(mediaRoot(), rel);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, input.bytes);

    const checksumSha256 = createHash('sha256')
      .update(input.bytes)
      .digest('hex');

    const row = await prisma.mediaAsset.create({
      data: {
        id,
        apiKeyId: owner,
        kind: input.kind,
        mime: input.mime,
        byteSize: input.bytes.length,
        storagePath: rel.replace(/\\/g, '/'),
        checksumSha256,
        originalName: input.originalName ?? null,
        source: input.source ?? 'generation',
        provider: input.provider ?? 'unknown',
        prompt: input.prompt ?? null,
        metaJson: input.meta ? JSON.stringify(input.meta) : null,
      },
    });

    return this.toPublic(row);
  }

  async getMeta(
    id: string,
    apiKeyId: string,
  ): Promise<StoredMediaAsset> {
    const owner = await toPersistentApiKeyId(apiKeyId);
    const row = await prisma.mediaAsset.findFirst({
      where: { id, apiKeyId: owner, deletedAt: null },
    });
    if (!row) throw ExceptionFactory.notFound('Media asset');
    return this.toPublic(row);
  }

  async readBytes(id: string, apiKeyId: string): Promise<{
    bytes: Buffer;
    mime: string;
    originalName: string | null;
  }> {
    const owner = await toPersistentApiKeyId(apiKeyId);
    const row = await prisma.mediaAsset.findFirst({
      where: { id, apiKeyId: owner, deletedAt: null },
    });
    if (!row) throw ExceptionFactory.notFound('Media asset');
    const full = path.join(mediaRoot(), row.storagePath);
    const bytes = await fs.readFile(full);
    return { bytes, mime: row.mime, originalName: row.originalName };
  }

  async softDelete(id: string, apiKeyId: string): Promise<void> {
    const owner = await toPersistentApiKeyId(apiKeyId);
    const row = await prisma.mediaAsset.findFirst({
      where: { id, apiKeyId: owner, deletedAt: null },
    });
    if (!row) throw ExceptionFactory.notFound('Media asset');
    await prisma.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private toPublic(row: {
    id: string;
    apiKeyId: string;
    kind: string;
    mime: string;
    byteSize: number;
    originalName: string | null;
    source: string;
    provider: string;
    prompt: string | null;
    createdAt: Date;
    metaJson: string | null;
  }): StoredMediaAsset {
    let meta: unknown;
    if (row.metaJson) {
      try {
        meta = JSON.parse(row.metaJson);
      } catch {
        meta = undefined;
      }
    }
    return {
      id: row.id,
      apiKeyId: row.apiKeyId,
      kind: row.kind,
      mime: row.mime,
      byteSize: row.byteSize,
      originalName: row.originalName,
      source: row.source,
      provider: row.provider,
      prompt: row.prompt,
      createdAt: row.createdAt,
      meta,
    };
  }
}

export const mediaStoreService = new MediaStoreService();
