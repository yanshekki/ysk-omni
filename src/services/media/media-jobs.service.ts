import { prisma } from '../../config/database';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { createId } from '../../utils/id';
import { toPersistentApiKeyId } from '../../utils/api-key-id';
import { apiFeaturesService } from '../api-features.service';
import { mediaStoreService } from './media-store.service';
import { vramScheduler } from '../vram-scheduler';
import { engineManager } from '../runtimes/engine-manager';
import type { AuthenticatedApiKey } from '../../interfaces';
import { KEY_MODES, ROLES } from '../../config/constants';
import { VIDEO_FIXTURE_B64 } from './video-fixture';
import { convertVideo } from './format-convert';

/** ffmpeg H.264 MP4 (32x32, 0.4s) with metadata comment ysk-omni-video-fixture. */
export function videoFixtureBytes(): Buffer {
  return Buffer.from(VIDEO_FIXTURE_B64, 'base64');
}

export const VIDEO_FIXTURE_BYTES = videoFixtureBytes();

export type MediaJobPublic = {
  id: string;
  object: 'video';
  status: string;
  model: string | null;
  prompt: string | null;
  created_at: number;
  completed_at: number | null;
  error: string | null;
  result_asset_id: string | null;
};

function toPublic(row: {
  id: string;
  status: string;
  model: string | null;
  prompt: string | null;
  createdAt: Date;
  completedAt: Date | null;
  errorMessage: string | null;
  resultAssetId: string | null;
}): MediaJobPublic {
  return {
    id: row.id,
    object: 'video',
    status: row.status,
    model: row.model,
    prompt: row.prompt,
    created_at: Math.floor(row.createdAt.getTime() / 1000),
    completed_at: row.completedAt
      ? Math.floor(row.completedAt.getTime() / 1000)
      : null,
    error: row.errorMessage,
    result_asset_id: row.resultAssetId,
  };
}

/**
 * Async video jobs (OpenAI-style poll model).
 * Mock provider completes immediately with a tiny PNG labeled as video placeholder
 * unless real video bytes available — status completed + asset for download.
 */
export class MediaJobsService {
  async createVideo(input: {
    apiKey: AuthenticatedApiKey;
    prompt: string;
    model?: string;
    /** Grok allows 6 or 10 only */
    seconds?: number;
    aspectRatio?: string;
    sourceAssetId?: string;
    sourceAssetIds?: string[];
    sourceDocumentId?: string;
    /** Uploaded frame bytes (admin SPA drag/drop) */
    sourceBytes?: Buffer;
    voices?: string[];
    format?: string;
  }): Promise<MediaJobPublic> {
    const features = await apiFeaturesService.get();
    if (!features.videoApi) {
      throw ExceptionFactory.featureDisabled(
        'videoApi',
        'Video API is disabled (Admin → API features → videoApi)',
      );
    }
    const isAdmin = input.apiKey.role === ROLES.ADMIN;
    const isAgent = input.apiKey.mode === KEY_MODES.AGENT;
    if (!isAdmin && !isAgent) {
      throw ExceptionFactory.mediaForbidden(
        'Video generation requires agent-mode or admin API key',
      );
    }

    const owner = await toPersistentApiKeyId(input.apiKey.id);
    const id = createId();
    const rawSec = Number(input.seconds);
    const seconds =
      Number.isFinite(rawSec) && rawSec >= 1 && rawSec <= 15
        ? Math.round(rawSec)
        : 6;
    const provider = 'fixture';

    const row = await prisma.mediaJob.create({
      data: {
        id,
        apiKeyId: owner,
        kind: 'video',
        status: 'queued',
        prompt: input.prompt,
        model: input.model ?? null,
        provider,
      },
    });

    void this.processVideoJob(row.id, owner, {
      prompt: input.prompt,
      model: input.model,
      seconds,
      aspectRatio: input.aspectRatio,
      sourceAssetId: input.sourceAssetId,
      extraAssetIds: input.sourceAssetIds,
      sourceDocumentId: input.sourceDocumentId,
      sourceBytes: input.sourceBytes,
      voices: input.voices,
      format: input.format,
    }).catch(() => undefined);

    return toPublic(row);
  }

  private async processVideoJob(
    jobId: string,
    apiKeyId: string,
    opts: {
      prompt: string;
      model?: string;
      seconds: number;
      aspectRatio?: string;
      sourceAssetId?: string;
      extraAssetIds?: string[];
      sourceDocumentId?: string;
      sourceBytes?: Buffer;
      voices?: string[];
      format?: string;
    },
  ): Promise<void> {
    await prisma.mediaJob.update({
      where: { id: jobId },
      data: { status: 'in_progress', startedAt: new Date() },
    });

    await engineManager.unloadAll();
    const exclusiveId = `video:${jobId}`;
    const plan = vramScheduler.load({
      id: exclusiveId,
      vramMb: 12_000,
      exclusive: true,
    });
    if (!plan.accept) {
      await prisma.mediaJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          errorMessage: 'VRAM does not fit exclusive video job',
          completedAt: new Date(),
        },
      });
      return;
    }

    try {
      let bytes = VIDEO_FIXTURE_BYTES;
      const videoUrl = (process.env.OMNI_VIDEO_URL || '').trim();
      if (videoUrl) {
        const upstream = await fetch(videoUrl.replace(/\/$/, '') + '/v1/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: opts.prompt,
            seconds: opts.seconds,
          }),
        });
        if (upstream.ok) {
          const ct = upstream.headers.get('content-type') || '';
          const raw = Buffer.from(await upstream.arrayBuffer());
          if (ct.includes('json')) {
            const parsed = JSON.parse(raw.toString('utf8')) as { b64?: string; b64_json?: string };
            const b64 = parsed.b64 || parsed.b64_json;
            if (b64) bytes = Buffer.from(b64, 'base64');
          } else if (raw.length) {
            bytes = raw;
          }
        }
      }
      const converted = convertVideo(bytes, opts.format);
      const stored = await mediaStoreService.save({
        apiKeyId,
        kind: 'video',
        mime: converted.mime,
        bytes: converted.bytes,
        originalName: `video-${jobId.slice(0, 8)}.${converted.format}`,
        source: 'generation',
        provider: 'fixture',
        prompt: opts.prompt,
        meta: {
          kind: 'video_fixture',
          seconds: opts.seconds,
          aspect_ratio: opts.aspectRatio,
        },
      });
      await prisma.mediaJob.update({
        where: { id: jobId },
        data: {
          status: 'completed',
          resultAssetId: stored.id,
          completedAt: new Date(),
        },
      });
    } catch (err) {
      await prisma.mediaJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          errorMessage:
            err instanceof Error ? err.message : 'Video generation failed',
          completedAt: new Date(),
        },
      });
    } finally {
      vramScheduler.unload(exclusiveId);
    }
  }

  async getJob(apiKeyId: string, jobId: string): Promise<MediaJobPublic> {
    const owner = await toPersistentApiKeyId(apiKeyId);
    const row = await prisma.mediaJob.findFirst({
      where: { id: jobId, apiKeyId: owner },
    });
    if (!row) throw ExceptionFactory.notFound('Video job');
    return toPublic(row);
  }

  async getJobContent(
    apiKeyId: string,
    jobId: string,
  ): Promise<{ bytes: Buffer; mime: string; originalName: string | null }> {
    const job = await this.getJob(apiKeyId, jobId);
    if (job.status !== 'completed' || !job.result_asset_id) {
      throw ExceptionFactory.validation(
        `Video job is not ready (status=${job.status})`,
      );
    }
    return mediaStoreService.readBytes(job.result_asset_id, apiKeyId);
  }
}

export const mediaJobsService = new MediaJobsService();
