import type { AuthenticatedApiKey } from './authenticated-api-key.interface';

/** Request-scoped context for chat completion creation. */
export interface ChatContext {
  apiKey: AuthenticatedApiKey;
  requestId: string;
  ip?: string;
  userAgent?: string;
}
