import type { ApiKeyMode } from '../interfaces/api-key-mode.type';
import type { ApiKeyRole } from '../interfaces/api-key-role.type';

export type { ApiKeyPublicEntity } from './api-key-public.entity';
export type { ApiKeyCreatedEntity } from './api-key-created.entity';

export interface ApiKeyEntity {
  id: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  role: ApiKeyRole;
  mode: ApiKeyMode;
  isActive: boolean;
  rateLimit: number;
  maxTurns: number | null;
  timeoutMs: number | null;
  createdAt: Date;
  lastUsedAt: Date | null;
}
