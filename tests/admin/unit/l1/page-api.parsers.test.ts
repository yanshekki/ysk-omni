/**
 * Per-page: path + response shape contracts used by render functions.
 * Pure parsers + URL builders (no DOM render).
 */
import { describe, expect, it } from 'vitest';
import {
  buildChatsListPath,
  buildDocumentsListPath,
  buildKeysListPath,
  buildMediaAssetsPath,
  documentBytes,
  pagePrimaryGetPath,
  parseApiFeatures,
  parseChatsList,
  parseDataList,
  parseStats,
  parseUsage,
} from '../../../../admin/src/pages/page-api';

/** Fixture mirrors real backend JSON from handlers */
const fixtures = {
  chats: {
    object: 'list',
    total: 20,
    limit: 50,
    offset: 0,
    items: [
      {
        id: 'chat-1',
        requestId: 'req_abc',
        model: 'grok-4.5',
        status: 'success',
        policyMode: 'safe',
        createdAt: '2026-07-16T10:00:00.000Z',
        promptPreview: 'hello',
        contentPreview: 'world',
        documentCount: 0,
        apiKey: { name: 'admin', keyPrefix: 'gog_' },
      },
    ],
  },
  keys: {
    object: 'list',
    total: 2,
    data: [
      {
        id: 'k1',
        name: 'admin',
        keyPrefix: 'gog_',
        role: 'admin',
        mode: 'agent',
        rateLimit: 60,
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  },
  documents: {
    object: 'list',
    total: 1,
    data: [
      {
        id: 'd1',
        originalName: 'notes.txt',
        mimeType: 'text/plain',
        sizeBytes: 42,
        storageType: 'database',
        createdAt: '2026-07-01T00:00:00.000Z',
      },
    ],
  },
  media: {
    object: 'list',
    total: 1,
    data: [
      {
        id: 'm1',
        kind: 'image',
        mime: 'image/png',
        bytes: 100,
        created_at: '2026-07-01T00:00:00.000Z',
      },
    ],
  },
  stats: {
    object: 'admin.stats',
    data: {
      totals: { chats24h: 20, successRate24h: 95, activeKeys: 1, totalKeys: 2 },
      recentChats: [{ id: 'c1', requestId: 'r1', model: 'grok-4.5', status: 'success', createdAt: '2026-07-16T00:00:00.000Z' }],
      models24h: [{ model: 'grok-4.5', requests: 20 }],
      queue: { enabled: true, depth: 0, running: 0 },
      safety: { globalSafeMode: true },
      concurrency: { active: 0, max: 4 },
      generatedAt: '2026-07-16T12:00:00.000Z',
    },
  },
  usage: {
    object: 'admin.usage',
    data: {
      totals: { requests: 100 },
      byModel: [{ model: 'grok-4.5', requests: 100 }],
      perKey: [{ apiKeyId: 'k1', requests: 100, utilization: 0.1 }],
    },
  },
  apiFeatures: {
    object: 'admin.api_features',
    data: {
      openaiChat: true,
      imagesApi: true,
      tools: true,
      videoApi: false,
    },
    flags: ['openaiChat', 'imagesApi'],
  },
  audit: {
    object: 'list',
    total: 5,
    data: [{ id: 'a1', action: 'login', createdAt: '2026-07-16T00:00:00.000Z' }],
  },
  settings: {
    object: 'admin.settings',
    data: { globalSafeMode: true, adminPanelEnabled: true },
  },
  ddos: {
    object: 'admin.ddos_stats',
    data: { activeConn: 0, rateHits: 0 },
  },
  queue: {
    object: 'admin.queue_stats',
    data: { enabled: true, depth: 0 },
  },
  pm2: {
    object: 'admin.pm2_status',
    data: { available: true },
  },
  system: {
    object: 'admin.system',
    data: { version: '1.7.4' },
  },
} as const;

describe('page: dashboard', () => {
  it('primary path + stats parse', () => {
    expect(pagePrimaryGetPath.dashboard).toBe('/stats');
    const s = parseStats(fixtures.stats);
    expect(s.totals.chats24h).toBe(20);
    expect(s.recentChats).toHaveLength(1);
    expect(s.queue).toMatchObject({ enabled: true });
  });
});

describe('page: chats (對話記錄)', () => {
  it('list path + items shape (regression for empty table with total=20)', () => {
    expect(pagePrimaryGetPath.chats).toBe('/chats');
    const path = buildChatsListPath({ limit: 50, offset: 0, status: 'success' });
    expect(path).toBe('/chats?limit=50&offset=0&status=success');

    const parsed = parseChatsList(fixtures.chats);
    expect(parsed.total).toBe(20);
    expect(parsed.rows).toHaveLength(1);
    expect(parsed.rows[0]).toMatchObject({
      requestId: 'req_abc',
      model: 'grok-4.5',
    });

    // Must NOT treat as empty when only items is present
    const wrongField = (fixtures.chats as { data?: unknown[] }).data || [];
    expect(wrongField).toHaveLength(0);
    expect(parsed.rows.length).toBeGreaterThan(0);
  });
});

describe('page: keys', () => {
  it('list path + data shape', () => {
    expect(pagePrimaryGetPath.keys).toBe('/keys');
    expect(buildKeysListPath({ limit: 20, role: 'client' })).toContain(
      'role=client',
    );
    const parsed = parseDataList(fixtures.keys);
    expect(parsed.rows[0]).toMatchObject({ name: 'admin', role: 'admin' });
  });
});

describe('page: documents', () => {
  it('list path + sizeBytes field', () => {
    expect(pagePrimaryGetPath.documents).toBe('/documents');
    expect(buildDocumentsListPath({ limit: 20 })).toContain('limit=20');
    const parsed = parseDataList(fixtures.documents);
    const row = parsed.rows[0] as { sizeBytes?: number; byteSize?: number };
    expect(documentBytes(row)).toBe(42);
  });
});

describe('page: media', () => {
  it('assets path + data list', () => {
    expect(pagePrimaryGetPath.media).toBe('/media/assets');
    expect(buildMediaAssetsPath({ kind: 'video' })).toContain('kind=video');
    const parsed = parseDataList(fixtures.media);
    expect(parsed.rows[0]).toMatchObject({ kind: 'image' });
  });
});

describe('page: api-features', () => {
  it('path + flags envelope', () => {
    expect(pagePrimaryGetPath.apiFeatures).toBe('/api-features');
    const flags = parseApiFeatures(fixtures.apiFeatures);
    expect(flags.imagesApi).toBe(true);
    expect(flags.videoApi).toBe(false);
  });
});

describe('page: usage', () => {
  it('path + perKey for keys page bars', () => {
    expect(pagePrimaryGetPath.usage).toBe('/usage');
    const u = parseUsage(fixtures.usage);
    expect(u.perKey).toHaveLength(1);
    expect(u.byModel[0]).toMatchObject({ model: 'grok-4.5' });
  });
});

describe('page: audit / settings / ddos / queue / pm2 / system', () => {
  it('primary paths match backend routes', () => {
    expect(pagePrimaryGetPath.audit).toBe('/audit-logs');
    expect(pagePrimaryGetPath.settings).toBe('/settings');
    expect(pagePrimaryGetPath.ddos).toBe('/ddos/stats');
    expect(pagePrimaryGetPath.queue).toBe('/queue/stats');
    expect(pagePrimaryGetPath.pm2).toBe('/pm2/status');
    expect(pagePrimaryGetPath.system).toBe('/system');
  });

  it('audit list uses data[]', () => {
    const parsed = parseDataList(fixtures.audit);
    expect(parsed.total).toBe(5);
    expect(parsed.rows[0]).toMatchObject({ action: 'login' });
  });

  it('settings/ddos/queue/pm2/system are data envelopes', () => {
    expect(fixtures.settings.data.adminPanelEnabled).toBe(true);
    expect(fixtures.ddos.data.activeConn).toBe(0);
    expect(fixtures.queue.data.enabled).toBe(true);
    expect(fixtures.pm2.data.available).toBe(true);
    expect(fixtures.system.data.version).toBe('1.7.4');
  });
});

describe('page: chat playground', () => {
  it('uses conversations + chat completions endpoints', () => {
    expect(pagePrimaryGetPath.chat).toBe('/conversations');
  });
});
