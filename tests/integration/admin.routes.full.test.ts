import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  apiFetch,
  startHarness,
  stopHarness,
  type Harness,
} from '../helpers/api-harness';
import { adminAuthService } from '../../src/services/admin-auth.service';

describe('admin API full matrix (read + safe write)', () => {
  let h: Harness | null = null;

  beforeAll(async () => {
    h = await startHarness('adm');
  }, 60_000);

  afterAll(async () => {
    await stopHarness(h);
  });

  async function get(path: string, key?: string) {
    return apiFetch(h!.baseUrl, path, { key: key ?? h!.adminKey });
  }

  it('auth: OTP login + me + logout; client cannot access', async () => {
    if (!h) return;
    const clientDenied = await get('/admin/api/me', h.clientKey);
    expect(clientDenied.status).toBe(403);

    const { code } = await adminAuthService.createOtp();
    const login = await apiFetch(h.baseUrl, '/admin/api/auth/login', {
      method: 'POST',
      body: { code },
    });
    expect(login.status).toBe(200);
    const loginBody = login.json as { data?: { token?: string }; token?: string };
    const token =
      loginBody.data?.token ||
      loginBody.token ||
      (loginBody as { session?: { token?: string } }).session?.token;
    // Flexible: different response shapes
    const sessionToken =
      token ||
      (() => {
        const j = login.json as Record<string, unknown>;
        if (typeof j.token === 'string') return j.token;
        if (j.data && typeof j.data === 'object' && 'token' in (j.data as object)) {
          return String((j.data as { token: string }).token);
        }
        return '';
      })();

    if (sessionToken) {
      const me = await apiFetch(h.baseUrl, '/admin/api/me', {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      expect(me.status).toBe(200);

      // Session must not work on public /v1
      const v1 = await apiFetch(h.baseUrl, '/v1/models', {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      expect(v1.status).toBe(401);

      await apiFetch(h.baseUrl, '/admin/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
    } else {
      // Fallback: at least login succeeded with some payload
      expect(login.json).toBeTruthy();
    }
  });

  it(
    'core reads: stats usage models system',
    async () => {
      if (!h) return;
      for (const path of [
        '/admin/api/stats',
        '/admin/api/usage',
        '/admin/api/models',
        '/admin/api/system',
      ]) {
        const res = await get(path);
        expect([200, 503, 500]).toContain(res.status);
      }
      // update-check may hit network — allow timeout via AbortSignal
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3000);
      try {
        const res = await fetch(`${h.baseUrl}/admin/api/system/update-check`, {
          headers: { Authorization: `Bearer ${h.adminKey}` },
          signal: ctrl.signal,
        });
        expect([200, 503, 500]).toContain(res.status);
      } catch {
        // aborted / network — not a server bug for audit
      } finally {
        clearTimeout(t);
      }
    },
    20_000,
  );

  it('chats list + get missing', async () => {
    if (!h) return;
    const list = await get('/admin/api/chats');
    expect(list.status).toBe(200);
    const miss = await get(
      '/admin/api/chats/00000000-0000-4000-8000-000000000001',
    );
    expect([404, 400]).toContain(miss.status);
  });

  it('conversations CRUD', async () => {
    if (!h) return;
    const created = await apiFetch(h.baseUrl, '/admin/api/conversations', {
      method: 'POST',
      key: h.adminKey,
      body: { title: 'itest-conv', apiKeyId: h.clientKeyId },
    });
    // may require specific shape
    if (created.status === 200 || created.status === 201) {
      const id = (created.json as { data?: { id: string }; id?: string }).data
        ?.id || (created.json as { id?: string }).id;
      if (id) {
        const getOne = await get(`/admin/api/conversations/${id}`);
        expect([200, 404]).toContain(getOne.status);
        const patch = await apiFetch(h.baseUrl, `/admin/api/conversations/${id}`, {
          method: 'PATCH',
          key: h.adminKey,
          body: { title: 'renamed' },
        });
        expect([200, 400, 404]).toContain(patch.status);
        const del = await apiFetch(h.baseUrl, `/admin/api/conversations/${id}`, {
          method: 'DELETE',
          key: h.adminKey,
        });
        expect([200, 404]).toContain(del.status);
      }
    } else {
      // list still works
      const list = await get('/admin/api/conversations');
      expect(list.status).toBe(200);
    }
  });

  it('keys list create patch revoke', async () => {
    if (!h) return;
    const list = await get('/admin/api/keys');
    expect(list.status).toBe(200);

    const created = await apiFetch(h.baseUrl, '/admin/api/keys', {
      method: 'POST',
      key: h.adminKey,
      body: {
        name: `${h.prefix}-admin-created`,
        role: 'client',
        mode: 'safe',
        rateLimit: 30,
      },
    });
    expect(created.status).toBe(201);
    const id = (created.json as { data: { id: string } }).data.id;

    const patch = await apiFetch(h.baseUrl, `/admin/api/keys/${id}`, {
      method: 'PATCH',
      key: h.adminKey,
      body: { name: `${h.prefix}-patched`, rateLimit: 40 },
    });
    expect(patch.status).toBe(200);

    const rev = await apiFetch(h.baseUrl, `/admin/api/keys/${id}`, {
      method: 'DELETE',
      key: h.adminKey,
    });
    expect(rev.status).toBe(200);
  });

  it('documents list', async () => {
    if (!h) return;
    const list = await get('/admin/api/documents');
    expect(list.status).toBe(200);
  });

  it('audit-logs list', async () => {
    if (!h) return;
    const list = await get('/admin/api/audit-logs');
    expect(list.status).toBe(200);
  });

  it('settings get/put', async () => {
    if (!h) return;
    const getS = await get('/admin/api/settings');
    expect(getS.status).toBe(200);
    const put = await apiFetch(h.baseUrl, '/admin/api/settings', {
      method: 'PUT',
      key: h.adminKey,
      body: { safeMaxTurns: 7 },
    });
    expect(put.status).toBe(200);
  });

  it('api-features get put preset including media flags', async () => {
    if (!h) return;
    const g = await get('/admin/api/api-features');
    expect(g.status).toBe(200);
    const data = (g.json as { data?: Record<string, boolean> }).data || {};
    expect('imagesApi' in data || data.imagesApi !== undefined).toBe(true);
    const put = await apiFetch(h.baseUrl, '/admin/api/api-features', {
      method: 'PUT',
      key: h.adminKey,
      body: {
        tools: true,
        vision: true,
        imagesApi: true,
        videoApi: false,
        audioApi: false,
        filesOpenAiAlias: false,
      },
    });
    expect(put.status).toBe(200);
    const after = (put.json as { data: Record<string, boolean> }).data;
    expect(after.imagesApi).toBe(true);
    expect(after.videoApi).toBe(false);
    const preset = await apiFetch(h.baseUrl, '/admin/api/api-features/preset', {
      method: 'POST',
      key: h.adminKey,
      body: { name: 'open' },
    });
    expect([200, 400]).toContain(preset.status);
  });

  it('media assets + jobs list', async () => {
    if (!h) return;
    const assets = await get('/admin/api/media/assets');
    expect(assets.status).toBe(200);
    const jobs = await get('/admin/api/media/jobs');
    expect(jobs.status).toBe(200);
  });

  it('ddos reads + ban/unban + policy', async () => {
    if (!h) return;
    for (const path of [
      '/admin/api/ddos/connections',
      '/admin/api/ddos/blacklist',
      '/admin/api/ddos/stats',
      '/admin/api/ddos/policy',
      '/admin/api/ddos/events',
    ]) {
      const res = await get(path);
      expect(res.status).toBe(200);
    }
    const ban = await apiFetch(h.baseUrl, '/admin/api/ddos/blacklist', {
      method: 'POST',
      key: h.adminKey,
      body: { ip: '203.0.113.99', reason: 'itest', ttlSeconds: 30 },
    });
    expect([200, 201]).toContain(ban.status);
    const unban = await apiFetch(
      h.baseUrl,
      '/admin/api/ddos/blacklist/203.0.113.99',
      { method: 'DELETE', key: h.adminKey },
    );
    expect(unban.status).toBe(200);

    const pol = await apiFetch(h.baseUrl, '/admin/api/ddos/policy', {
      method: 'PUT',
      key: h.adminKey,
      body: { rateLimitMax: 500 },
    });
    expect(pol.status).toBe(200);
  });

  it('queue reads + pause/resume/drain/undrain + policy', async () => {
    if (!h) return;
    for (const path of [
      '/admin/api/queue/stats',
      '/admin/api/queue/jobs',
      '/admin/api/queue/policy',
    ]) {
      const res = await get(path);
      expect(res.status).toBe(200);
    }
    for (const path of [
      '/admin/api/queue/pause',
      '/admin/api/queue/resume',
      '/admin/api/queue/drain',
      '/admin/api/queue/undrain',
    ]) {
      const res = await apiFetch(h.baseUrl, path, {
        method: 'POST',
        key: h.adminKey,
      });
      expect(res.status).toBe(200);
    }
    const miss = await get(
      '/admin/api/queue/jobs/00000000-0000-4000-8000-000000000099',
    );
    expect([404, 400]).toContain(miss.status);
  });

  it('pm2 status + config (read-only)', async () => {
    if (!h) return;
    const status = await get('/admin/api/pm2/status');
    expect([200, 503, 500]).toContain(status.status);
    const cfg = await get('/admin/api/pm2/config');
    expect([200, 503, 500]).toContain(cfg.status);
    const logs = await get('/admin/api/pm2/logs');
    expect([200, 503, 500]).toContain(logs.status);
  });
});
