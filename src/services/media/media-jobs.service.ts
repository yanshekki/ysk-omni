import { prisma } from '../../config/database';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { createId } from '../../utils/id';
import { toPersistentApiKeyId } from '../../utils/api-key-id';
import { apiFeaturesService } from '../api-features.service';
import { mediaStoreService } from './media-store.service';
import { mockMediaProvider } from './providers/mock.provider';
import type { AuthenticatedApiKey } from '../../interfaces';
import { KEY_MODES, ROLES } from '../../config/constants';

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
    const providerEnv = (process.env.MEDIA_PROVIDER || 'grok-tools').toLowerCase();
    const provider =
      providerEnv === 'mock' || providerEnv === 'none' || providerEnv === 'stub'
        ? providerEnv === 'mock'
          ? 'mock'
          : 'stub'
        : 'grok-tools';

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
    },
  ): Promise<void> {
    await prisma.mediaJob.update({
      where: { id: jobId },
      data: { status: 'in_progress', startedAt: new Date() },
    });

    try {
      const providerEnv = (process.env.MEDIA_PROVIDER || 'grok-tools').toLowerCase();
      if (providerEnv === 'mock' || providerEnv === 'none' || providerEnv === 'stub') {
        const arts = await mockMediaProvider.generateImage({
          prompt: `[video placeholder ${opts.seconds}s] ${opts.prompt}`,
          apiKeyId,
          n: 1,
          aspectRatio: opts.aspectRatio,
        });
        const art = arts[0]!;
        const stored = await mediaStoreService.save({
          apiKeyId,
          kind: 'video',
          mime: 'image/png',
          bytes: art.bytes,
          originalName: `video-${jobId.slice(0, 8)}.png`,
          source: 'generation',
          provider: art.source.provider,
          prompt: opts.prompt,
          meta: {
            kind: 'video_placeholder',
            seconds: opts.seconds,
            aspect_ratio: opts.aspectRatio,
            note: 'Mock video uses PNG placeholder',
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
        return;
      }

      // Real path: Grok image_to_video via CLI (needs a source frame)
      const { grokToolsMediaProvider } = await import(
        './providers/grok-tools.provider'
      );
      const { settingsService } = await import('../settings.service');
      const { env } = await import('../../config/env');
      const { resolveGrokAspectRatio } = await import('../../config/constants');

      let sourceBytes: Buffer | null = opts.sourceBytes?.length
        ? opts.sourceBytes
        : null;
      if (!sourceBytes && opts.sourceAssetId) {
        const got = await mediaStoreService.readBytes(
          opts.sourceAssetId,
          apiKeyId,
        );
        sourceBytes = got.bytes;
      } else if (opts.sourceDocumentId) {
        const { documentService } = await import('../document.service');
        const doc = await documentService.getOwned(
          apiKeyId,
          opts.sourceDocumentId,
        );
        sourceBytes = await documentService.readDecryptedContent(
          doc.apiKeyId,
          doc.id,
        );
      }

      const settings = await settingsService.getAll();
      const model = opts.model || settings.defaultModel;
      const aspect = resolveGrokAspectRatio(null, opts.aspectRatio);
      // Limits follow system Safety settings (same as image gen)
      const timeoutMs = settings.globalSafeMode
        ? settings.safeTimeoutMs
        : env.GROK_TIMEOUT_MS;
      const maxTurns = settings.globalSafeMode ? settings.safeMaxTurns : null;

      // No source → text→image frame first (Grok has no pure text-to-video)
      if (!sourceBytes) {
        const frameArts = await grokToolsMediaProvider.generateImage({
          prompt: opts.prompt,
          apiKeyId,
          n: 1,
          model,
          aspectRatio: aspect,
          timeoutMs,
          maxTurns,
          alwaysApprove: true,
          permissionMode: 'bypassPermissions',
        });
        sourceBytes = frameArts[0]?.bytes ?? null;
      }

      if (!sourceBytes) {
        throw new Error('No source frame for image_to_video');
      }

      const extraFrames: Buffer[] = [];
      for (const extraId of opts.extraAssetIds || []) {
        try {
          const got = await mediaStoreService.readBytes(extraId, apiKeyId);
          extraFrames.push(got.bytes);
        } catch {
          /* skip missing extras */
        }
      }
      const useReference =
        Boolean(opts.voices?.length) || extraFrames.length > 0;

      const videoArts = useReference
        ? await grokToolsMediaProvider.generateVideoFromReferences({
            prompt: opts.prompt,
            images: [sourceBytes, ...extraFrames],
            voices: opts.voices,
            apiKeyId,
            model,
            seconds: opts.seconds,
            aspectRatio: opts.aspectRatio,
            timeoutMs,
            maxTurns,
            alwaysApprove: true,
            permissionMode: 'bypassPermissions',
          })
        : await grokToolsMediaProvider.generateVideoFromImage({
            prompt: opts.prompt,
            imageBytes: sourceBytes,
            apiKeyId,
            model,
            seconds: opts.seconds,
            aspectRatio: opts.aspectRatio,
            timeoutMs,
            maxTurns,
            alwaysApprove: true,
            permissionMode: 'bypassPermissions',
          });
      const art = videoArts[0]!;
      const stored = await mediaStoreService.save({
        apiKeyId,
        kind: 'video',
        mime: art.mime,
        bytes: art.bytes,
        originalName: art.originalName || `video-${jobId.slice(0, 8)}.mp4`,
        source: 'generation',
        provider: art.source.provider,
        prompt: opts.prompt,
        meta: {
          kind: 'video',
          seconds: opts.seconds,
          aspect_ratio: opts.aspectRatio,
          source_asset_id: opts.sourceAssetId || null,
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
