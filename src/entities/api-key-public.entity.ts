import type { ApiKeyMode } from '../interfaces/api-key-mode.type';
import type { ApiKeyRole } from '../interfaces/api-key-role.type';

export interface ApiKeyPublicEntity {
  id: string;
  name: string;
  keyPrefix: string;
  role: ApiKeyRole;
  mode: ApiKeyMode;
  isActive: boolean;
  rateLimit: number;
  maxTurns: number | null;
  timeoutMs: number | null;
  /** Empty = allow all IPs */
  ipWhitelist: string[];
  createdAt: Date;
  lastUsedAt: Date | null;
}
