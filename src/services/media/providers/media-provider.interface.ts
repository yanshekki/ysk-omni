/** Pluggable media generation backends (Grok tools, HTTP providers, mock). */

export type MediaKind = 'image' | 'video' | 'audio' | 'file';

export interface MediaArtifact {
  bytes: Buffer;
  mime: string;
  originalName?: string;
  width?: number;
  height?: number;
  durationMs?: number;
  source: {
    provider: string;
    rawMeta?: unknown;
  };
}

export interface ImageGenRequest {
  prompt: string;
  model?: string;
  n?: number;
  /** OpenAI-compat pixel size or legacy field; prefer aspectRatio */
  size?: string;
  /** Grok Imagine aspect_ratio (1:1, 16:9, …) */
  aspectRatio?: string;
  /** Working directory for tool-based providers */
  cwd?: string;
  apiKeyId: string;
  /** From policyService / system settings (aligned with chat) */
  timeoutMs?: number;
  maxTurns?: number | null;
  alwaysApprove?: boolean;
  toolsAllowlist?: string | null;
  toolsDenylist?: string | null;
  permissionMode?: string | null;
}

export interface ImageEditRequest extends ImageGenRequest {
  imageBytes: Buffer;
  imageMime?: string;
  maskBytes?: Buffer;
}

export interface MediaProvider {
  readonly id: string;
  generateImage(req: ImageGenRequest): Promise<MediaArtifact[]>;
  editImage?(req: ImageEditRequest): Promise<MediaArtifact[]>;
}
