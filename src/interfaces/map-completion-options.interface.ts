import type { EngineResponseMeta } from './engine-response-meta.interface';
import type { EngineToolCall } from './engine-collected-output.interface';

/** Options when mapping local engine output → OpenAI chat.completion */
export interface MapCompletionOptions {
  completionId?: string;
  reasoningContent?: string | null;
  includeReasoning?: boolean;
  omni?: EngineResponseMeta;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details?: {
      cached_tokens?: number;
      cache_creation_tokens?: number;
    };
  };
  toolCalls?: EngineToolCall[];
}
