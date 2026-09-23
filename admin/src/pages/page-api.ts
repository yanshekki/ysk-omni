/**
 * Pure page ↔ Admin API contracts (URL builders + response parsers).
 * No DOM / fetch — unit-tested in isolation.
 *
 * Backend list shapes differ by domain:
 *   chats → { items, total }
 *   keys / documents / media / audit → { data, total }
 *   stats / usage / settings / system → { object, data: {...} }
 */
import { endpoints } from '../config/endpoints';
import { listRows, listTotal, type ListEnvelope } from '../lib/list';

export type ChatListFilter = {
  q?: string;
  status?: string;
  model?: string;
  apiKeyId?: string;
  from?: string;
  to?: string;
  policyMode?: string;
  hasDocuments?: string;
  limit?: number;
  offset?: number;
};

export type KeyListFilter = {
  q?: string;
  role?: string;
  mode?: string;
  isActive?: string;
  limit?: number;
  offset?: number;
  all?: boolean;
};

export type DocListFilter = {
  q?: string;
  apiKeyId?: string;
  storageType?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};

export type MediaListFilter = {
  kind?: string;
  limit?: number;
  offset?: number;
};

/* ——— URL builders ——— */

export function buildChatsListPath(f: ChatListFilter = {}): string {
  const q = new URLSearchParams();
  q.set('limit', String(f.limit ?? 50));
  q.set('offset', String(f.offset ?? 0));
  if (f.q) q.set('q', f.q);
  if (f.status) q.set('status', f.status);
  if (f.model) q.set('model', f.model);
  if (f.apiKeyId) q.set('apiKeyId', f.apiKeyId);
  if (f.policyMode) q.set('policyMode', f.policyMode);
  if (f.hasDocuments !== undefined && f.hasDocuments !== '') {
    q.set('hasDocuments', f.hasDocuments);
  }
  if (f.from) {
    const d = new Date(f.from);
    if (!Number.isNaN(d.getTime())) q.set('from', d.toISOString());
  }
  if (f.to) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(f.to)) {
      // date-only → end of that UTC day (stable across TZ)
      q.set('to', `${f.to}T23:59:59.999Z`);
    } else {
      const end = new Date(f.to);
      if (!Number.isNaN(end.getTime())) q.set('to', end.toISOString());
    }
  }
  return `${endpoints.chats}?${q}`;
}

export function buildKeysListPath(f: KeyListFilter = {}): string {
  const q = new URLSearchParams();
  if (f.limit != null) q.set('limit', String(f.limit));
  if (f.offset != null) q.set('offset', String(f.offset));
  if (f.q) q.set('q', f.q);
  if (f.role) q.set('role', f.role);
  if (f.mode) q.set('mode', f.mode);
  if (f.isActive) q.set('isActive', f.isActive);
  if (f.all) q.set('all', '1');
  const qs = q.toString();
  return qs ? `${endpoints.keys}?${qs}` : endpoints.keys;
}

export function buildDocumentsListPath(f: DocListFilter = {}): string {
  const q = new URLSearchParams();
  q.set('limit', String(f.limit ?? 20));
  q.set('offset', String(f.offset ?? 0));
  if (f.q) q.set('q', f.q);
  if (f.apiKeyId) q.set('apiKeyId', f.apiKeyId);
  if (f.storageType) q.set('storageType', f.storageType);
  if (f.from) {
    const d = new Date(f.from);
    if (!Number.isNaN(d.getTime())) q.set('from', d.toISOString());
  }
  if (f.to) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(f.to)) {
      q.set('to', `${f.to}T23:59:59.999Z`);
    } else {
      const end = new Date(f.to);
      if (!Number.isNaN(end.getTime())) q.set('to', end.toISOString());
    }
  }
  return `${endpoints.documents}?${q}`;
}

export function buildMediaAssetsPath(f: MediaListFilter = {}): string {
  const q = new URLSearchParams();
  q.set('limit', String(f.limit ?? 50));
  if (f.offset) q.set('offset', String(f.offset));
  if (f.kind) q.set('kind', f.kind);
  return `${endpoints.mediaAssets}?${q}`;
}

export function buildMediaJobsPath(limit = 30): string {
  return `${endpoints.mediaJobs}?limit=${limit}`;
}

export function buildAuditListPath(opts: {
  q?: string;
  limit?: number;
  offset?: number;
  action?: string;
  apiKeyId?: string;
} = {}): string {
  const q = new URLSearchParams();
  q.set('limit', String(opts.limit ?? 50));
  q.set('offset', String(opts.offset ?? 0));
  if (opts.q) q.set('q', opts.q);
  if (opts.action) q.set('action', opts.action);
  if (opts.apiKeyId) q.set('apiKeyId', opts.apiKeyId);
  return `${endpoints.audit}?${q}`;
}

/* ——— Absolute paths used by pages (for contract tests) ——— */

export const pageApiPaths = {
  login: endpoints.auth.login,
  logout: endpoints.auth.logout,
  me: endpoints.me,
  dashboard: endpoints.stats,
  chats: endpoints.chats,
  chatCompletions: endpoints.chatCompletions,
  conversations: endpoints.conversations,
  keys: endpoints.keys,
  documents: endpoints.documents,
  mediaAssets: endpoints.mediaAssets,
  mediaJobs: endpoints.mediaJobs,
  apiFeatures: endpoints.apiFeatures,
  apiFeaturesPreset: endpoints.apiFeaturesPreset,
  audit: endpoints.audit,
  settings: endpoints.settings,
  usage: endpoints.usage,
  ddos: endpoints.ddos,
  queue: endpoints.queue,
  pm2: endpoints.pm2,
  system: endpoints.system,
  models: endpoints.models,
} as const;

export type PageApiName = keyof typeof pageApiPaths;

/** Every navigable page id → primary GET path (for registry tests) */
export const pagePrimaryGetPath: Record<string, string> = {
  login: pageApiPaths.login, // POST actually
  dashboard: pageApiPaths.dashboard,
  chat: pageApiPaths.conversations,
  chats: pageApiPaths.chats,
  keys: pageApiPaths.keys,
  documents: pageApiPaths.documents,
  media: pageApiPaths.mediaAssets,
  audit: pageApiPaths.audit,
  settings: pageApiPaths.settings,
  apiFeatures: pageApiPaths.apiFeatures,
  usage: pageApiPaths.usage,
  ddos: pageApiPaths.ddos,
  queue: pageApiPaths.queue,
  pm2: pageApiPaths.pm2,
  system: pageApiPaths.system,
};

/* ——— Response parsers ——— */

export type ParsedList<T> = {
  rows: T[];
  total: number;
  limit?: number;
  offset?: number;
};

export function parseListEnvelope<T>(
  res: ListEnvelope<T> | null | undefined,
): ParsedList<T> {
  const rows = listRows(res);
  return {
    rows,
    total: listTotal(res, rows),
    limit: res?.limit,
    offset: res?.offset,
  };
}

/** Chats admin list — backend uses `items` */
export function parseChatsList(res: unknown): ParsedList<Record<string, unknown>> {
  return parseListEnvelope(res as ListEnvelope<Record<string, unknown>>);
}

/** Keys / documents / audit / media — backend uses `data` */
export function parseDataList(res: unknown): ParsedList<Record<string, unknown>> {
  return parseListEnvelope(res as ListEnvelope<Record<string, unknown>>);
}

/** Nested { object, data: T } */
export function parseDataEnvelope<T>(res: unknown): T | null {
  if (!res || typeof res !== 'object') return null;
  const o = res as { data?: T };
  return o.data ?? null;
}

/** Stats dashboard */
export function parseStats(res: unknown): {
  totals: Record<string, unknown>;
  recentChats: unknown[];
  models24h: unknown[];
  queue: unknown;
  safety: unknown;
  generatedAt?: string;
} {
  const data = parseDataEnvelope<Record<string, unknown>>(res) || {};
  const recent = Array.isArray(data.recentChats) ? data.recentChats : [];
  const models = Array.isArray(data.models24h) ? data.models24h : [];
  return {
    totals: (data.totals as Record<string, unknown>) || {},
    recentChats: recent,
    models24h: models,
    queue: data.queue ?? null,
    safety: data.safety ?? null,
    generatedAt:
      typeof data.generatedAt === 'string' ? data.generatedAt : undefined,
  };
}

/** Usage page */
export function parseUsage(res: unknown): {
  totals: Record<string, unknown>;
  byModel: unknown[];
  perKey: unknown[];
} {
  const data = parseDataEnvelope<Record<string, unknown>>(res) || {};
  return {
    totals: (data.totals as Record<string, unknown>) || {},
    byModel: Array.isArray(data.byModel) ? data.byModel : [],
    perKey: Array.isArray(data.perKey) ? data.perKey : [],
  };
}

/** API features */
export function parseApiFeatures(res: unknown): Record<string, boolean> {
  const data = parseDataEnvelope<Record<string, boolean>>(res);
  return data && typeof data === 'object' ? data : {};
}

/** Document row size field (backend: sizeBytes) */
export function documentBytes(row: {
  sizeBytes?: number;
  byteSize?: number;
}): number | undefined {
  if (typeof row.sizeBytes === 'number') return row.sizeBytes;
  if (typeof row.byteSize === 'number') return row.byteSize;
  return undefined;
}

/** Models catalog → string ids */
export function parseModelsList(res: unknown): string[] {
  if (!res || typeof res !== 'object') return [];
  const o = res as { data?: { models?: unknown[] }; models?: unknown[] };
  const raw = o.data?.models || o.models || [];
  if (!Array.isArray(raw)) return [];
  return raw.map((m) =>
    typeof m === 'string' ? m : String((m as { id?: string }).id || m),
  );
}
