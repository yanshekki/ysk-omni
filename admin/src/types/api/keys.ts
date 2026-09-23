export type ApiKeyRow = {
  id: string;
  name: string;
  keyPrefix: string;
  role: string;
  mode: string;
  rateLimit: number;
  maxTurns?: number | null;
  timeoutMs?: number | null;
  ipWhitelist?: string[];
  isActive: boolean;
  createdAt: string;
  /** Present only once on create */
  key?: string;
};

export type KeysListResponse = {
  object: 'list';
  total: number;
  limit?: number;
  offset?: number;
  data: ApiKeyRow[];
};

export type CreateKeyBody = {
  name: string;
  role: string;
  mode: string;
  rateLimit: number;
  maxTurns?: number | null;
  timeoutMs?: number | null;
  ipWhitelist?: string[];
};

export type UpdateKeyBody = CreateKeyBody & {
  isActive?: boolean;
};
