import type { StreamWireFormat } from './chat-job-payload.interface';

/** Options for chatService.createCompletion / executeCompletion */
export interface ExecuteCompletionOptions {
  /** Called by queue worker — skip enqueue */
  fromQueue?: boolean;
  jobId?: string;
  /** SSE headers already sent (queue status event) */
  sseAlreadyInit?: boolean;
  source?: 'v1' | 'playground';
  /** Scoped idempotency key (usually apiKeyId:clientKey) */
  idempotencyKey?: string;
  /** SSE protocol shape (default openai chat.completion.chunk) */
  wireFormat?: StreamWireFormat;
  /** Do not emit gog.queue SSE objects (for Anthropic/Responses purity) */
  suppressQueueEvents?: boolean;
}
