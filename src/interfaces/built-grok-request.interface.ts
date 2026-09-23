import type { GrokRunOptions } from './grok-run-options.interface';

/** Result of mapping a chat DTO + policy + features → Grok CLI invocation pieces */
export type GrokVisionFile = {
  filename: string;
  mimeType: string;
  bytes: Buffer;
};

export interface BuiltGrokRequest {
  prompt: string;
  promptJson?: string;
  jsonSchema?: string;
  toolsAllowlist?: string | null;
  toolsDenylist?: string | null;
  extra: Partial<GrokRunOptions>;
  estimatedPromptTokens: number;
  /** Decoded image parts to write under cwd when argv cannot hold --prompt-json. */
  visionFiles?: GrokVisionFile[];
}
