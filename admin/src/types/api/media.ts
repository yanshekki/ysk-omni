/** Mirrors admin media.handlers.ts JSON */

export type MediaAssetRow = {
  id: string;
  kind: string;
  mime: string;
  bytes: number;
  filename?: string | null;
  originalName?: string | null;
  source?: string | null;
  provider?: string | null;
  prompt?: string | null;
  created_at: string;
  apiKeyId?: string | null;
  apiKeyName?: string | null;
  apiKeyPrefix?: string | null;
};

export type MediaJobRow = {
  id: string;
  status: string;
  prompt?: string | null;
  result_asset_id?: string | null;
  created_at: string;
  error?: string | null;
};

export type MediaAssetsList = {
  object: 'list';
  total: number;
  limit: number;
  offset: number;
  data: MediaAssetRow[];
};

export type MediaJobsList = {
  object?: string;
  total?: number;
  data: MediaJobRow[];
};
