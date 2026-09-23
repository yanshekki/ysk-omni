import { describe, expect, it } from 'vitest';
import {
  buildAuditListPath,
  buildChatsListPath,
  buildDocumentsListPath,
  buildKeysListPath,
  buildMediaAssetsPath,
  buildMediaJobsPath,
  documentBytes,
  pageApiPaths,
  pagePrimaryGetPath,
  parseApiFeatures,
  parseChatsList,
  parseDataEnvelope,
  parseDataList,
  parseModelsList,
  parseStats,
  parseUsage,
} from '../../../../admin/src/pages/page-api';

describe('page-api URL builders', () => {
  it('buildChatsListPath includes filters and defaults', () => {
    const path = buildChatsListPath({
      limit: 50,
      offset: 0,
      status: 'success',
      q: 'req-1',
    });
    expect(path.startsWith('/chats?')).toBe(true);
    expect(path).toContain('limit=50');
    expect(path).toContain('offset=0');
    expect(path).toContain('status=success');
    expect(path).toContain('q=req-1');
  });

  it('buildChatsListPath expands date-only `to` to end of UTC day', () => {
    const path = buildChatsListPath({ to: '2026-07-01' });
    expect(decodeURIComponent(path)).toContain('to=2026-07-01T23:59:59.999Z');
  });

  it('buildKeysListPath supports all=1 and empty query', () => {
    expect(buildKeysListPath()).toBe('/keys');
    expect(buildKeysListPath({ all: true })).toBe('/keys?all=1');
    expect(buildKeysListPath({ role: 'admin', limit: 20 })).toContain(
      'role=admin',
    );
  });

  it('buildDocumentsListPath and media paths', () => {
    expect(buildDocumentsListPath({ limit: 10 })).toContain('/documents?');
    expect(buildDocumentsListPath({ storageType: 'filesystem' })).toContain(
      'storageType=filesystem',
    );
    expect(buildMediaAssetsPath({ kind: 'image', limit: 50 })).toBe(
      '/media/assets?limit=50&kind=image',
    );
    expect(buildMediaJobsPath(30)).toBe('/media/jobs?limit=30');
  });

  it('buildAuditListPath', () => {
    expect(buildAuditListPath({ limit: 50 })).toContain('/audit-logs?');
    expect(buildAuditListPath({ action: 'login' })).toContain('action=login');
  });
});

describe('page-api paths registry (every page has an API)', () => {
  const expected: Record<string, string> = {
    dashboard: '/stats',
    chat: '/conversations',
    chats: '/chats',
    keys: '/keys',
    documents: '/documents',
    media: '/media/assets',
    audit: '/audit-logs',
    settings: '/settings',
    apiFeatures: '/api-features',
    usage: '/usage',
    ddos: '/ddos/stats',
    queue: '/queue/stats',
    pm2: '/pm2/status',
    system: '/system',
  };

  for (const [page, path] of Object.entries(expected)) {
    it(`page "${page}" primary GET → ${path}`, () => {
      expect(pagePrimaryGetPath[page]).toBe(path);
      expect(Object.values(pageApiPaths)).toContain(path);
    });
  }

  it('auth + models paths exist', () => {
    expect(pageApiPaths.login).toBe('/auth/login');
    expect(pageApiPaths.logout).toBe('/auth/logout');
    expect(pageApiPaths.me).toBe('/me');
    expect(pageApiPaths.models).toBe('/models');
    expect(pageApiPaths.chatCompletions).toBe('/chat/completions');
    expect(pageApiPaths.apiFeaturesPreset).toBe('/api-features/preset');
  });
});

describe('page-api response parsers', () => {
  it('parseChatsList reads items (not data)', () => {
    const parsed = parseChatsList({
      object: 'list',
      total: 20,
      items: [
        { id: 'c1', requestId: 'r1' },
        { id: 'c2', requestId: 'r2' },
      ],
    });
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.total).toBe(20);
    expect(parsed.rows[0]).toMatchObject({ id: 'c1' });
  });

  it('parseDataList reads data array', () => {
    const parsed = parseDataList({
      total: 1,
      data: [{ id: 'k1', name: 'admin' }],
    });
    expect(parsed.rows[0]).toMatchObject({ name: 'admin' });
    expect(parsed.total).toBe(1);
  });

  it('parseStats extracts dashboard fields', () => {
    const stats = parseStats({
      object: 'admin.stats',
      data: {
        totals: { chats24h: 5, successRate24h: 100 },
        recentChats: [{ id: '1', requestId: 'x' }],
        models24h: [{ model: 'grok-4.5', requests: 3 }],
        queue: { enabled: true, depth: 0 },
        safety: { globalSafeMode: true },
        generatedAt: '2026-07-16T00:00:00.000Z',
      },
    });
    expect(stats.totals.chats24h).toBe(5);
    expect(stats.recentChats).toHaveLength(1);
    expect(stats.models24h).toHaveLength(1);
    expect(stats.queue).toMatchObject({ enabled: true });
    expect(stats.generatedAt).toContain('2026');
  });

  it('parseUsage extracts perKey / byModel', () => {
    const u = parseUsage({
      object: 'admin.usage',
      data: {
        totals: { requests: 10 },
        byModel: [{ model: 'grok-4.5', requests: 10 }],
        perKey: [{ apiKeyId: 'k1', requests: 10, utilization: 0.2 }],
      },
    });
    expect(u.perKey).toHaveLength(1);
    expect(u.byModel).toHaveLength(1);
  });

  it('parseApiFeatures reads flags object', () => {
    const f = parseApiFeatures({
      object: 'admin.api_features',
      data: { imagesApi: true, tools: false },
    });
    expect(f.imagesApi).toBe(true);
    expect(f.tools).toBe(false);
  });

  it('parseDataEnvelope null-safe', () => {
    expect(parseDataEnvelope(null)).toBeNull();
    expect(parseDataEnvelope({ data: { a: 1 } })).toEqual({ a: 1 });
  });

  it('documentBytes prefers sizeBytes', () => {
    expect(documentBytes({ sizeBytes: 100, byteSize: 9 })).toBe(100);
    expect(documentBytes({ byteSize: 9 })).toBe(9);
    expect(documentBytes({})).toBeUndefined();
  });

  it('parseModelsList normalizes string | {id}', () => {
    expect(
      parseModelsList({
        data: { models: ['grok-4.5', { id: 'grok-3' }] },
      }),
    ).toEqual(['grok-4.5', 'grok-3']);
  });
});
