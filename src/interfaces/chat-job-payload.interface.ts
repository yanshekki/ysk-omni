import type { CreateChatCompletionDto } from '../dto/chat.dto';

/** SSE wire format for multi-protocol streaming */
export type StreamWireFormat = 'openai' | 'anthropic' | 'responses';

/** Encrypted payload stored on ChatJob */
export interface ChatJobPayload {
  dto: CreateChatCompletionDto;
  requestId: string;
  apiKeyId: string;
  apiKeySnapshot: {
    id: string;
    name: string;
    keyPrefix: string;
    role: string;
    mode: string;
    rateLimit: number;
    isActive: boolean;
    maxTurns: number | null;
    timeoutMs: number | null;
    ipWhitelist: string[];
  };
  ip?: string;
  userAgent?: string;
  source: 'v1' | 'playground';
  /** How to format SSE when streaming (default openai) */
  wireFormat?: StreamWireFormat;
}
