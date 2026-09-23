import type { OpenAiChatMessage } from './open-ai-chat-message.interface';

/**
 * OpenAI Chat Completions request shape (documentation + static typing).
 *
 * Runtime validation uses Zod: `CreateChatCompletionDto` in `dto/chat.dto.ts`.
 * Prefer the DTO at API boundaries; this interface tracks the OpenAI-compatible
 * surface (including Grok extensions).
 */
export interface OpenAiChatCompletionRequest {
  model?: string;
  messages: OpenAiChatMessage[];
  stream?: boolean;
  /** Accepted for SDK compatibility — not applied by Grok CLI unless mapped later */
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  n?: number;
  stop?: string | string[];
  user?: string;
  tools?: unknown[];
  tool_choice?: unknown;
  response_format?: {
    type?: 'text' | 'json_object' | 'json_schema';
    json_schema?: unknown;
  };
  stream_options?: { include_usage?: boolean };

  // Grok / gateway extensions
  cwd?: string;
  session_id?: string;
  document_ids?: string[];
  include_reasoning?: boolean;
  reasoning_effort?: string;
  system_prompt_override?: string;
  rules?: string;
  permission_mode?: string;
  sandbox?: string;
  allow?: string[];
  deny?: string[];
  disable_web_search?: boolean;
  no_subagents?: boolean;
  no_plan?: boolean;
  no_memory?: boolean;
  experimental_memory?: boolean;
  best_of_n?: number;
  check?: boolean;
  verbatim?: boolean;
  agent?: string;
  agents?: unknown;
  resume?: string;
  continue?: boolean;
  fork_session?: boolean;
  json_schema?: unknown;
}
