import {
  AUDIT_ACTIONS,
  KEY_MODES,
  ROLES,
  resolveGrokAspectRatio,
} from '../../config/constants';
import type { AuthenticatedApiKey } from '../../interfaces';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { apiFeaturesService } from '../api-features.service';
import { auditService } from '../audit.service';
import { policyService } from '../policy.service';
import { settingsService } from '../settings.service';
import { mediaStoreService } from './media-store.service';
import type {
  ImageEditRequest,
  ImageGenRequest,
  MediaArtifact,
  MediaProvider,
} from './providers/media-provider.interface';
import { grokToolsMediaProvider } from './providers/grok-tools.provider';
import { mockMediaProvider } from './providers/mock.provider';
import { stubMediaProvider } from './providers/stub.provider';

/** Test / forced provider override */
let providerOverride: MediaProvider | null = null;

export function setMediaProviderForTests(p: MediaProvider | null): void {
  providerOverride = p;
}

export function resolveMediaProvider(): MediaProvider {
  if (providerOverride) return providerOverride;
  const envName = (process.env.MEDIA_PROVIDER || '').toLowerCase();
  if (envName === 'mock') return mockMediaProvider;
  if (envName === 'none' || envName === 'stub') return stubMediaProvider;
  if (envName === 'grok' || envName === 'grok-tools' || !envName) {
    return grokToolsMediaProvider;
  }
  return stubMediaProvider;
}

export type ImageGenerationResult = {
  created: number;
  data: Array<{
    b64_json?: string;
    url?: string;
    revised_prompt?: string;
  }>;
  /** Gateway extension */
  grok?: {
    provider: string;
    asset_ids: string[];
  };
};

function assertImageAccess(apiKey: AuthenticatedApiKey): void {
  const isAdmin = apiKey.role === ROLES.ADMIN;
  const isAgent = apiKey.mode === KEY_MODES.AGENT;
  if (!isAdmin && !isAgent) {
    throw ExceptionFactory.mediaForbidden(
      'Image generation requires an agent-mode API key (or admin). Safe keys cannot use image tools.',
      { reason: 'agent_or_admin_required' },
    );
  }
}

async function assertImagesEnabled(): Promise<void> {
  const features = await apiFeaturesService.get();
  if (!features.imagesApi) {
    throw ExceptionFactory.featureDisabled(
      'imagesApi',
      'Images API is disabled (Admin → API features → imagesApi)',
    );
  }
  if (!features.tools) {
    throw ExceptionFactory.featureDisabled(
      'tools',
      'Tools are disabled; image generation requires tools (image_gen / image_edit)',
    );
  }
}

async function persistArtifacts(input: {
  apiKey: AuthenticatedApiKey;
  artifacts: MediaArtifact[];
  prompt: string;
  size?: string;
  responseFormat?: 'b64_json' | 'url';
  baseUrl?: string;
  source: string;
  providerId: string;
  ip?: string;
  metaExtra?: Record<string, unknown>;
}): Promise<ImageGenerationResult> {
  const format = input.responseFormat || 'b64_json';
  const data: ImageGenerationResult['data'] = [];
  const assetIds: string[] = [];

  for (const art of input.artifacts) {
    const stored = await mediaStoreService.save({
      apiKeyId: input.apiKey.id,
      kind: 'image',
      mime: art.mime,
      bytes: art.bytes,
      originalName: art.originalName,
      source: input.source,
      provider: art.source.provider,
      prompt: input.prompt,
      meta: {
        size: input.size,
        ...((art.source.rawMeta as object) || {}),
        ...(input.metaExtra || {}),
      },
    });
    assetIds.push(stored.id);
    if (format === 'url') {
      const base = (input.baseUrl || '').replace(/\/$/, '');
      data.push({ url: `${base}/v1/media/assets/${stored.id}/content` });
    } else {
      data.push({ b64_json: art.bytes.toString('base64') });
    }
  }

  await auditService.log({
    apiKeyId: input.apiKey.id,
    action: AUDIT_ACTIONS.MEDIA_GENERATE,
    resource: 'media_asset',
    resourceId: assetIds[0],
    meta: {
      provider: input.providerId,
      count: assetIds.length,
      format,
      source: input.source,
      promptChars: input.prompt.length,
    },
    ip: input.ip,
  });

  return {
    created: Math.floor(Date.now() / 1000),
    data,
    grok: { provider: input.providerId, asset_ids: assetIds },
  };
}

/**
 * Map system policy + settings → image provider run options.
 *
 * **Limits (must match chat):**
 * - `maxTurns` / `timeoutMs` from `policyService.resolve` (key override →
 *   Safety settings when global/key safe, else env `GROK_TIMEOUT_MS` / unlimited turns)
 * - `model` from request or `settings.defaultModel`
 *
 * **Tools (media-specific):** callers already passed `assertImageAccess`
 * (admin or agent key). Image gen needs write/Imagine tools, so we do **not**
 * apply safe-mode denylist/allowlist here — that would strip Write/bash and
 * break headless Imagine. Limits still follow Safety / key settings.
 */
async function policyToImageRun(
  apiKey: AuthenticatedApiKey,
  partial: Omit<
    ImageGenRequest,
    | 'apiKeyId'
    | 'timeoutMs'
    | 'maxTurns'
    | 'alwaysApprove'
    | 'toolsAllowlist'
    | 'toolsDenylist'
    | 'permissionMode'
    | 'model'
  > & {
    model?: string;
  },
): Promise<ImageGenRequest> {
  const [policy, settings] = await Promise.all([
    policyService.resolve(apiKey),
    settingsService.getAll(),
  ]);
  // Headless media: auto-approve so permission prompts do not stall the run.
  // Limits (maxTurns / timeout) still come from policy → system Safety settings.
  return {
    ...partial,
    apiKeyId: apiKey.id,
    model: partial.model || settings.defaultModel || undefined,
    timeoutMs: policy.timeoutMs,
    maxTurns: policy.maxTurns,
    alwaysApprove: true,
    toolsAllowlist: null,
    toolsDenylist: null,
    permissionMode: 'bypassPermissions',
  };
}

export class MediaOrchestratorService {
  async generateImages(input: {
    apiKey: AuthenticatedApiKey;
    prompt: string;
    model?: string;
    n?: number;
    size?: string;
    aspectRatio?: string;
    responseFormat?: 'b64_json' | 'url';
    baseUrl?: string;
    ip?: string;
  }): Promise<ImageGenerationResult> {
    await assertImagesEnabled();
    assertImageAccess(input.apiKey);

    const aspectRatio = resolveGrokAspectRatio(input.size, input.aspectRatio);
    const provider = resolveMediaProvider();
    const req = await policyToImageRun(input.apiKey, {
      prompt: input.prompt,
      model: input.model,
      n: input.n ?? 1,
      size: input.size,
      aspectRatio,
    });

    const artifacts = await provider.generateImage(req);
    if (!artifacts.length) {
      throw ExceptionFactory.mediaGenerationFailed('Provider returned no images');
    }

    return persistArtifacts({
      apiKey: input.apiKey,
      artifacts,
      prompt: input.prompt,
      size: aspectRatio,
      responseFormat: input.responseFormat,
      baseUrl: input.baseUrl,
      source: 'generation',
      providerId: provider.id,
      ip: input.ip,
      metaExtra: { aspect_ratio: aspectRatio, size_in: input.size || null },
    });
  }

  async editImages(input: {
    apiKey: AuthenticatedApiKey;
    prompt: string;
    imageBytes: Buffer;
    imageMime?: string;
    maskBytes?: Buffer;
    model?: string;
    n?: number;
    size?: string;
    aspectRatio?: string;
    responseFormat?: 'b64_json' | 'url';
    baseUrl?: string;
    ip?: string;
  }): Promise<ImageGenerationResult> {
    await assertImagesEnabled();
    assertImageAccess(input.apiKey);

    const provider = resolveMediaProvider();
    if (!provider.editImage) {
      throw ExceptionFactory.mediaNotSupported(
        `Provider "${provider.id}" does not support image edits`,
        { reason: 'provider_no_edit', provider: provider.id },
      );
    }

    const aspectRatio = resolveGrokAspectRatio(input.size, input.aspectRatio);
    // Same policy source of truth as chat + generateImages (maxTurns/timeout/model)
    const base = await policyToImageRun(input.apiKey, {
      prompt: input.prompt,
      model: input.model,
      n: input.n ?? 1,
      size: input.size,
      aspectRatio,
    });
    const req: ImageEditRequest = {
      ...base,
      imageBytes: input.imageBytes,
      imageMime: input.imageMime,
      maskBytes: input.maskBytes,
    };

    const artifacts = await provider.editImage(req);
    if (!artifacts.length) {
      throw ExceptionFactory.mediaGenerationFailed('Provider returned no edited images');
    }

    return persistArtifacts({
      apiKey: input.apiKey,
      artifacts,
      prompt: input.prompt,
      size: aspectRatio,
      responseFormat: input.responseFormat,
      baseUrl: input.baseUrl,
      source: 'edit',
      providerId: provider.id,
      ip: input.ip,
      metaExtra: { aspect_ratio: aspectRatio, size_in: input.size || null },
    });
  }

  async getAsset(apiKeyId: string, id: string) {
    return mediaStoreService.getMeta(id, apiKeyId);
  }

  async getAssetContent(apiKeyId: string, id: string) {
    return mediaStoreService.readBytes(id, apiKeyId);
  }
}

export const mediaOrchestratorService = new MediaOrchestratorService();
