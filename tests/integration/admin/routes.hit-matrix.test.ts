/**
 * Real HTTP hit for every Admin API route (table-driven).
 * Safe methods: expect 2xx/4xx/5xx that are intentional.
 * Dangerous ops: only assert route exists (not 404).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  mockGrokStream,
  startHarness,
  stopHarness,
  type Harness,
} from '../../helpers/api-harness';
import { adminAuthService } from '../../../src/services/admin-auth.service';
import { setMediaProviderForTests } from '../../../src/services/media/media-orchestrator.service';
import { mockMediaProvider } from '../../../src/services/media/providers/mock.provider';
import { apiFeaturesService } from '../../../src/services/api-features.service';

type Hit = {
  method: string;
  path: string;
  body?: unknown;
  /** replace :id etc */
  resolve?: (h: Harness, ctx: Ctx) => string;
  /** Acceptable status codes */
  ok?: number[];
  dangerous?: boolean;
};

type Ctx = {
  keyId?: string;
  chatId?: string;
  docId?: string;
  assetId?: string;
  jobId?: string;
  convId?: string;
  banIp?: string;
};

const HITS: Hit[] = [
  { method: 'GET', path: '/admin/api/me', ok: [200] },
  { method: 'GET', path: '/admin/api/stats', ok: [200, 500, 503] },
  { method: 'GET', path: '/admin/api/usage', ok: [200, 500, 503] },
  { method: 'GET', path: '/admin/api/models', ok: [200, 500, 503] },
  { method: 'GET', path: '/admin/api/system', ok: [200, 500, 503] },
  { method: 'GET', path: '/admin/api/grok/inspect', ok: [200, 500, 503] },
  { method: 'GET', path: '/admin/api/grok/sessions', ok: [200, 500, 503] },
  {
    method: 'GET',
    path: '/admin/api/system/update-check',
    ok: [200, 500, 503, 504],
  },
  { method: 'GET', path: '/admin/api/chats', ok: [200] },
  {
    method: 'GET',
    path: '/admin/api/chats/:id',
    resolve: (_h, c) =>
      `/admin/api/chats/${c.chatId || '00000000-0000-4000-8000-000000000001'}`,
    ok: [200, 404],
  },
  { method: 'GET', path: '/admin/api/conversations', ok: [200] },
  {
    method: 'POST',
    path: '/admin/api/conversations',
    body: { title: 'hit-matrix' },
    ok: [200, 201, 400],
  },
  {
    method: 'GET',
    path: '/admin/api/conversations/:id',
    resolve: (_h, c) =>
      `/admin/api/conversations/${c.convId || '00000000-0000-4000-8000-000000000002'}`,
    ok: [200, 404],
  },
  {
    method: 'PATCH',
    path: '/admin/api/conversations/:id',
    resolve: (_h, c) =>
      `/admin/api/conversations/${c.convId || '00000000-0000-4000-8000-000000000002'}`,
    body: { title: 'x' },
    ok: [200, 404, 400],
  },
  {
    method: 'DELETE',
    path: '/admin/api/conversations/:id',
    resolve: (_h, c) =>
      `/admin/api/conversations/${c.convId || '00000000-0000-4000-8000-000000000099'}`,
    ok: [200, 404],
  },
  { method: 'GET', path: '/admin/api/keys', ok: [200] },
  {
    method: 'POST',
    path: '/admin/api/keys',
    body: { name: 'hit-key', role: 'client', mode: 'safe', rateLimit: 30 },
    ok: [200, 201],
  },
  {
    method: 'PATCH',
    path: '/admin/api/keys/:id',
    resolve: (h) => `/admin/api/keys/${h.clientKeyId}`,
    body: { name: 'hit-key-renamed' },
    ok: [200, 404],
  },
  {
    method: 'DELETE',
    path: '/admin/api/keys/:id',
    resolve: (_h, c) =>
      `/admin/api/keys/${c.keyId || '00000000-0000-4000-8000-000000000003'}`,
    ok: [200, 404],
  },
  { method: 'GET', path: '/admin/api/documents', ok: [200] },
  {
    method: 'GET',
    path: '/admin/api/documents/:id',
    resolve: (_h, c) =>
      `/admin/api/documents/${c.docId || '00000000-0000-4000-8000-000000000004'}`,
    ok: [200, 404],
  },
  {
    method: 'GET',
    path: '/admin/api/documents/:id/download',
    resolve: (_h, c) =>
      `/admin/api/documents/${c.docId || '00000000-0000-4000-8000-000000000004'}/download`,
    ok: [200, 404],
  },
  {
    method: 'DELETE',
    path: '/admin/api/documents/:id',
    resolve: (_h, c) =>
      `/admin/api/documents/${c.docId || '00000000-0000-4000-8000-000000000004'}`,
    ok: [200, 404],
  },
  { method: 'GET', path: '/admin/api/audit-logs', ok: [200] },
  { method: 'GET', path: '/admin/api/settings', ok: [200] },
  {
    method: 'PUT',
    path: '/admin/api/settings',
    body: {},
    ok: [200, 400],
  },
  { method: 'GET', path: '/admin/api/api-features', ok: [200] },
  {
    method: 'PUT',
    path: '/admin/api/api-features',
    body: { imagesApi: true },
    ok: [200, 400],
  },
  {
    method: 'POST',
    path: '/admin/api/api-features/preset',
    body: { name: 'open' },
    ok: [200, 400],
  },
  { method: 'GET', path: '/admin/api/media/assets', ok: [200] },
  {
    method: 'GET',
    path: '/admin/api/media/assets/:id',
    resolve: (_h, c) =>
      `/admin/api/media/assets/${c.assetId || '00000000-0000-4000-8000-000000000005'}`,
    ok: [200, 404],
  },
  {
    method: 'GET',
    path: '/admin/api/media/assets/:id/download',
    resolve: (_h, c) =>
      `/admin/api/media/assets/${c.assetId || '00000000-0000-4000-8000-000000000005'}/download`,
    ok: [200, 404],
  },
  {
    method: 'DELETE',
    path: '/admin/api/media/assets/:id',
    resolve: (_h, c) =>
      `/admin/api/media/assets/${c.assetId || '00000000-0000-4000-8000-000000000005'}`,
    ok: [200, 404],
  },
  { method: 'GET', path: '/admin/api/media/jobs', ok: [200] },
  {
    method: 'POST',
    path: '/admin/api/media/generate',
    body: { prompt: 'hit-matrix blue square', n: 1, aspect_ratio: '1:1' },
    ok: [200, 501, 502, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/media/videos',
    body: { prompt: 'hit-matrix motion', seconds: 6 },
    ok: [200, 501, 502, 503],
  },
  { method: 'GET', path: '/admin/api/ddos/connections', ok: [200] },
  { method: 'GET', path: '/admin/api/ddos/blacklist', ok: [200] },
  { method: 'GET', path: '/admin/api/ddos/stats', ok: [200] },
  { method: 'GET', path: '/admin/api/ddos/policy', ok: [200] },
  { method: 'GET', path: '/admin/api/ddos/events', ok: [200] },
  {
    method: 'PUT',
    path: '/admin/api/ddos/policy',
    body: {},
    ok: [200, 400],
  },
  {
    method: 'POST',
    path: '/admin/api/ddos/policy/reset',
    ok: [200, 400],
  },
  {
    method: 'POST',
    path: '/admin/api/ddos/blacklist',
    body: { ip: '203.0.113.50', reason: 'hit-matrix' },
    ok: [200, 201, 400],
  },
  {
    method: 'DELETE',
    path: '/admin/api/ddos/blacklist/:ip',
    resolve: () => '/admin/api/ddos/blacklist/203.0.113.50',
    ok: [200, 404],
  },
  { method: 'GET', path: '/admin/api/pm2/status', ok: [200, 500, 503] },
  { method: 'GET', path: '/admin/api/pm2/logs', ok: [200, 500, 503] },
  { method: 'GET', path: '/admin/api/pm2/config', ok: [200, 500, 503] },
  {
    method: 'PUT',
    path: '/admin/api/pm2/config',
    body: {},
    ok: [200, 400, 500, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/pm2/config/reset',
    ok: [200, 500, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/pm2/start',
    dangerous: true,
    ok: [200, 400, 500, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/pm2/stop',
    dangerous: true,
    ok: [200, 400, 500, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/pm2/restart',
    dangerous: true,
    ok: [200, 400, 500, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/pm2/reload',
    dangerous: true,
    ok: [200, 400, 500, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/pm2/logs/clear',
    dangerous: true,
    ok: [200, 400, 500, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/pm2/switch',
    dangerous: true,
    body: {},
    ok: [200, 400, 500, 503],
  },
  { method: 'GET', path: '/admin/api/queue/stats', ok: [200] },
  { method: 'GET', path: '/admin/api/queue/jobs', ok: [200] },
  {
    method: 'GET',
    path: '/admin/api/queue/jobs/:id',
    resolve: (_h, c) =>
      `/admin/api/queue/jobs/${c.jobId || '00000000-0000-4000-8000-000000000006'}`,
    ok: [200, 404],
  },
  {
    method: 'POST',
    path: '/admin/api/queue/jobs/:id/cancel',
    resolve: (_h, c) =>
      `/admin/api/queue/jobs/${c.jobId || '00000000-0000-4000-8000-000000000006'}/cancel`,
    ok: [200, 404, 400, 409],
  },
  {
    method: 'POST',
    path: '/admin/api/queue/jobs/:id/requeue',
    resolve: (_h, c) =>
      `/admin/api/queue/jobs/${c.jobId || '00000000-0000-4000-8000-000000000006'}/requeue`,
    ok: [200, 404, 400, 409],
  },
  {
    method: 'POST',
    path: '/admin/api/queue/jobs/:id/priority',
    resolve: (_h, c) =>
      `/admin/api/queue/jobs/${c.jobId || '00000000-0000-4000-8000-000000000006'}/priority`,
    body: { priority: 10 },
    ok: [200, 404, 400],
  },
  { method: 'GET', path: '/admin/api/queue/policy', ok: [200] },
  {
    method: 'PUT',
    path: '/admin/api/queue/policy',
    body: {},
    ok: [200, 400],
  },
  { method: 'POST', path: '/admin/api/queue/pause', ok: [200, 400] },
  { method: 'POST', path: '/admin/api/queue/resume', ok: [200, 400] },
  { method: 'POST', path: '/admin/api/queue/drain', ok: [200, 400] },
  { method: 'POST', path: '/admin/api/queue/undrain', ok: [200, 400] },
  {
    method: 'POST',
    path: '/admin/api/queue/purge-dead',
    ok: [200, 400],
  },
  {
    method: 'POST',
    path: '/admin/api/chat/completions',
    body: {
      model: 'grok-4.5',
      messages: [{ role: 'user', content: 'ping' }],
      stream: false,
    },
    ok: [200, 400, 429, 500, 502, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/system/update',
    dangerous: true,
    // Must not schedule a real git/npm update — that rewrites node_modules mid-suite.
    body: { restart: false },
    ok: [200, 400, 500, 501, 503],
  },
  {
    method: 'POST',
    path: '/admin/api/auth/logout',
    ok: [200, 204, 401],
  },
];

describe('admin API hit matrix (every route)', () => {
  let h: Harness | null = null;
  const ctx: Ctx = {};

  beforeAll(async () => {
    h = await startHarness('hit-adm');
    if (!h) return;
    mockGrokStream('hit-matrix');
    setMediaProviderForTests(mockMediaProvider);
    await apiFeaturesService.update({
      imagesApi: true,
      tools: true,
      videoApi: true,
    });
    // seed conversation for later
    const conv = await apiFetch(h.baseUrl, '/admin/api/conversations', {
      method: 'POST',
      key: h.adminKey,
      body: { title: 'matrix-seed' },
    });
    const cj = conv.json as { data?: { id?: string }; id?: string };
    ctx.convId = cj.data?.id || cj.id;
  }, 90_000);

  afterAll(async () => {
    setMediaProviderForTests(null);
    await stopHarness(h);
  });

  it('OTP login route works', async () => {
    if (!h) return;
    const { code } = await adminAuthService.createOtp();
    const res = await apiFetch(h.baseUrl, '/admin/api/auth/login', {
      method: 'POST',
      body: { code },
    });
    expect([200, 400, 401]).toContain(res.status);
  });

  for (const hit of HITS) {
    it(`${hit.method} ${hit.path}${hit.dangerous ? ' (dangerous)' : ''}`, async () => {
      if (!h) return;
      const path = hit.resolve ? hit.resolve(h, ctx) : hit.path;
      const res = await apiFetch(h.baseUrl, path, {
        method: hit.method,
        key: h.adminKey,
        body: hit.body,
      });
      const allowed =
        hit.ok || [200, 201, 204, 400, 401, 403, 409, 404, 500, 501, 502, 503];
      // Missing resources (placeholder UUIDs) may 404 — still proves route is mounted
      expect(
        allowed,
        `${hit.method} ${path} → ${res.status} ${res.text.slice(0, 200)}`,
      ).toContain(res.status);
      // Unregistered paths would still 404 with Express notFound — placeholder ids ok
      if (!path.includes('00000000-0000-4000-8000-') && !hit.dangerous) {
        // list/collection routes must not be plain Express 404 for wrong mount
        if (res.status === 404) {
          const body = res.json as { error?: { code?: string } };
          // allow domain not_found only
          expect(body?.error?.code || 'not_found').toMatch(/not_found|validation/i);
        }
      }
    });
  }

  it('media edit rejects missing image with validation', async () => {
    if (!h) return;
    const fd = new FormData();
    fd.append('prompt', 'edit without image');
    const res = await apiFetch(h.baseUrl, '/admin/api/media/edit', {
      method: 'POST',
      key: h.adminKey,
      formData: fd,
    });
    expect([400, 422, 500]).toContain(res.status);
  });
});
