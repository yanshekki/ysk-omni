export interface TrackedConnection {
  id: string;
  ip: string;
  method: string;
  path: string;
  userAgent: string;
  startedAt: number;
  finishedAt?: number;
  durationMs?: number;
  statusCode?: number;
  apiKeyId?: string;
  apiKeyPrefix?: string;
  apiKeyName?: string;
  state: 'active' | 'finished';
}
