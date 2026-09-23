import type { GrokResponseMeta } from './grok-response-meta.interface';
import type { GrokToolCall } from './grok-collected-output.interface';

/** Options when mapping Grok CLI output → OpenAI chat.completion */
export interface MapCompletionOptions {
  completionId?: string;
  reasoningContent?: string | null;
  includeReasoning?: boolean;
  grok?: GrokResponseMeta;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details?: {
      cached_tokens?: number;
      cache_creation_tokens?: number;
    };
  };
  toolCalls?: GrokToolCall[];
}
