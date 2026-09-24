import type { EngineRunOptions } from './engine-run-options.interface';

/** Result of mapping a chat DTO + policy + features → local engine invocation pieces */
export type EngineVisionFile = {
  filename: string;
  mimeType: string;
  bytes: Buffer;
};

export interface BuiltEngineRequest {
  prompt: string;
  promptJson?: string;
  jsonSchema?: string;
  toolsAllowlist?: string | null;
  toolsDenylist?: string | null;
  extra: Partial<EngineRunOptions>;
  estimatedPromptTokens: number;
  /** Decoded image parts to write under cwd when argv cannot hold --prompt-json. */
  visionFiles?: EngineVisionFile[];
}
