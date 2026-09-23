import type { ApiKeyPublicEntity } from './api-key-public.entity';

export interface ApiKeyCreatedEntity extends ApiKeyPublicEntity {
  /** Plaintext key — only returned once at creation time */
  key: string;
}
