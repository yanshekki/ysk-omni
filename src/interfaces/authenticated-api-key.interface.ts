import type { ApiKeyMode } from './api-key-mode.type';
import type { ApiKeyRole } from './api-key-role.type';

/** Resolved API key attached to authenticated requests. */
export interface AuthenticatedApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  role: ApiKeyRole;
  mode: ApiKeyMode;
  rateLimit: number;
  isActive: boolean;
  maxTurns: number | null;
  timeoutMs: number | null;
  ipWhitelist: string[];
}
