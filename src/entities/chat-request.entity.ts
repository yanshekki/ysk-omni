import type { ChatRequestStatus } from './chat-request-status.type';

export type { ChatRequestStatus } from './chat-request-status.type';
export type { EncryptedPayload } from './encrypted-payload.entity';

export interface ChatRequestEntity {
  id: string;
  requestId: string;
  apiKeyId: string;
  model: string;
  stream: boolean;
  status: ChatRequestStatus;
  durationMs: number | null;
  grokSessionId: string | null;
  errorMessage: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}
