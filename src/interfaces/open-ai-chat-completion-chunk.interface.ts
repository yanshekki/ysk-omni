import type { GrokResponseMeta } from './grok-response-meta.interface';

export interface OpenAiChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: 'assistant';
      content?: string;
      /** DeepSeek-compatible streaming CoT */
      reasoning_content?: string;
      /** Grok alias of reasoning_content */
      thought?: string;
      tool_calls?: Array<{
        index?: number;
        id?: string;
        type?: 'function';
        function?: { name?: string; arguments?: string };
      }>;
    };
    finish_reason: 'stop' | 'length' | 'content_filter' | 'tool_calls' | null;
  }>;
  /** Present on final chunk when available */
  grok?: GrokResponseMeta;
  /** Live Grok ACP session update (tool_call / tool_call_update / plan). */
  grok_event?: {
    type: string;
    toolCallId?: string;
    toolName?: string;
    status?: string;
    kind?: string;
    title?: string;
    rawInput?: unknown;
    entries?: unknown;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details?: {
      cached_tokens?: number;
      cache_creation_tokens?: number;
    };
  };
}
