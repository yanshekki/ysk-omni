import type { OpenAiRole } from './open-ai-role.type';

export interface OpenAiChatMessage {
  role: OpenAiRole | string;
  content: string | null | Array<Record<string, unknown>>;
  /** DeepSeek-compatible: prior turn reasoning (optional; often ignored in multi-turn) */
  reasoning_content?: string | null;
  name?: string;
}
