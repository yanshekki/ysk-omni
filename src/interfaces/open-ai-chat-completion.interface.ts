import type { GrokResponseMeta } from './grok-response-meta.interface';
import type { OpenAiChatCompletionChoice } from './open-ai-chat-completion-choice.interface';

export interface OpenAiChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: OpenAiChatCompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details?: {
      cached_tokens?: number;
      cache_creation_tokens?: number;
    };
  };
  /** Grok-native extension block */
  grok?: GrokResponseMeta;
}
