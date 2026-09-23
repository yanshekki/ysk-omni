import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import {
  allFetchUrls,
  installFetchMock,
  lastFetchInit,
  lastFetchUrl,
} from '../../helpers/mock-fetch';

installBrowserShim();

describe('admin page services → HTTP contracts', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
  });

  it('authService.loginWithOtp POST /auth/login (noAuth) + stores token', async () => {
    const fetchMock = installFetchMock([
      {
        match: '/admin/api/auth/login',
        method: 'POST',
        body: { data: { token: 'gog_sess_new' } },
      },
    ]);
    // clear default token so we verify setToken after login
    sessionStorage.removeItem('gog_admin_session');

    const { authService } = await import(
      '../../../../admin/src/services/auth.service'
    );
    const token = await authService.loginWithOtp('ABCD-EFGH');
    expect(token).toBe('gog_sess_new');
    expect(lastFetchUrl(fetchMock)).toContain('/admin/api/auth/login');
    const init = lastFetchInit(fetchMock)!;
    expect(init.method).toBe('POST');
    expect(init.headers).not.toHaveProperty('Authorization');
    expect(JSON.parse(String(init.body))).toEqual({ code: 'ABCD-EFGH' });
    expect(sessionStorage.getItem('gog_admin_session')).toBe('gog_sess_new');
  });

  it('authService.me GET /me with Bearer', async () => {
    const fetchMock = installFetchMock([
      {
        match: '/admin/api/me',
        body: { data: { id: 'u1', name: 'Admin', role: 'admin' } },
      },
    ]);
    const { authService } = await import(
      '../../../../admin/src/services/auth.service'
    );
    const me = await authService.me();
    expect(me.name).toBe('Admin');
    expect(lastFetchUrl(fetchMock)).toContain('/admin/api/me');
    expect(
      (lastFetchInit(fetchMock)!.headers as Record<string, string>)
        .Authorization,
    ).toMatch(/^Bearer /);
  });

  it('statsService.get → GET /stats (dashboard page)', async () => {
    const fetchMock = installFetchMock([
      {
        match: '/admin/api/stats',
        body: {
          object: 'admin.stats',
          data: { totals: { chats24h: 2 }, recentChats: [] },
        },
      },
    ]);
    const { statsService } = await import(
      '../../../../admin/src/services/stats.service'
    );
    const res = await statsService.get();
    expect(res.data?.totals?.chats24h).toBe(2);
    expect(lastFetchUrl(fetchMock)).toBe('/admin/api/stats');
  });

  it('keysService.list builds query (keys page)', async () => {
    const fetchMock = installFetchMock([
      {
        match: '/admin/api/keys',
        body: {
          object: 'list',
          total: 1,
          data: [{ id: 'k1', name: 'a', keyPrefix: 'gog_', role: 'admin', mode: 'safe', rateLimit: 60, isActive: true, createdAt: '' }],
        },
      },
    ]);
    const { keysService } = await import(
      '../../../../admin/src/services/keys.service'
    );
    const res = await keysService.list({
      role: 'admin',
      limit: 20,
      offset: 0,
    });
    expect(res.data).toHaveLength(1);
    const url = lastFetchUrl(fetchMock);
    expect(url).toContain('/admin/api/keys?');
    expect(url).toContain('role=admin');
    expect(url).toContain('limit=20');
  });

  it('keysService.revoke DELETE /keys/:id', async () => {
    const fetchMock = installFetchMock([
      { match: '/admin/api/keys/k1', method: 'DELETE', body: { deleted: true } },
    ]);
    const { keysService } = await import(
      '../../../../admin/src/services/keys.service'
    );
    await keysService.revoke('k1');
    expect(lastFetchUrl(fetchMock)).toContain('/admin/api/keys/k1');
    expect(lastFetchInit(fetchMock)!.method).toBe('DELETE');
  });

  it('documentsService.list (documents page)', async () => {
    const fetchMock = installFetchMock([
      {
        match: '/admin/api/documents',
        body: {
          total: 1,
          data: [
            {
              id: 'd1',
              originalName: 'a.txt',
              sizeBytes: 12,
              mimeType: 'text/plain',
            },
          ],
        },
      },
    ]);
    const { documentsService } = await import(
      '../../../../admin/src/services/documents.service'
    );
    const res = await documentsService.list({ limit: 20, offset: 0, q: 'a' });
    expect(res.data?.[0].sizeBytes).toBe(12);
    const url = lastFetchUrl(fetchMock);
    expect(url).toContain('/admin/api/documents?');
    expect(url).toContain('q=a');
  });

  it('mediaService listAssets + listJobs + remove (media page)', async () => {
    const fetchMock = installFetchMock([
      {
        match: /\/media\/assets\/m1$/,
        method: 'DELETE',
        body: { deleted: true },
      },
      {
        match: /\/media\/assets\?/,
        method: 'GET',
        body: {
          total: 1,
          data: [
            {
              id: 'm1',
              kind: 'image',
              mime: 'image/png',
              bytes: 1,
              created_at: '',
            },
          ],
        },
      },
      {
        match: /\/media\/jobs\?/,
        method: 'GET',
        body: { data: [{ id: 'j1', status: 'completed', created_at: '' }] },
      },
    ]);
    const { mediaService } = await import(
      '../../../../admin/src/services/media.service'
    );
    const assets = await mediaService.listAssets({ kind: 'image', limit: 50 });
    expect(assets.data).toHaveLength(1);
    const jobs = await mediaService.listJobs({ limit: 30 });
    expect(jobs.data).toHaveLength(1);
    await mediaService.remove('m1');
    const urls = allFetchUrls(fetchMock);
    expect(urls.some((u) => u.includes('/media/assets?') && u.includes('kind=image'))).toBe(true);
    expect(urls.some((u) => u.includes('/media/jobs?limit=30'))).toBe(true);
    expect(urls.some((u) => u.includes('/media/assets/m1'))).toBe(true);
  });

  it('featuresService get/update/preset (api-features page)', async () => {
    const fetchMock = installFetchMock([
      {
        match: '/api-features/preset',
        method: 'POST',
        body: { data: { tools: true }, preset: 'open' },
      },
      {
        match: '/api-features',
        method: 'PUT',
        body: { data: { imagesApi: false } },
      },
      {
        match: '/api-features',
        method: 'GET',
        body: {
          object: 'admin.api_features',
          data: { imagesApi: true, tools: true },
        },
      },
    ]);
    const { featuresService } = await import(
      '../../../../admin/src/services/features.service'
    );
    const get = await featuresService.get();
    expect(get.data.imagesApi).toBe(true);
    await featuresService.update({ imagesApi: false });
    await featuresService.applyPreset('open');
    const urls = allFetchUrls(fetchMock);
    expect(urls[0]).toContain('/admin/api/api-features');
    expect(urls.some((u) => u.includes('/api-features/preset'))).toBe(true);
  });
});

describe('admin page API error handling', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
  });

  it('HttpError on 4xx with message envelope', async () => {
    installFetchMock([
      {
        match: '/admin/api/stats',
        status: 403,
        body: {
          error: {
            code: 'forbidden',
            message: 'Admin panel disabled',
          },
        },
      },
    ]);
    const { statsService } = await import(
      '../../../../admin/src/services/stats.service'
    );
    const { HttpError } = await import('../../../../admin/src/lib/http');
    await expect(statsService.get()).rejects.toBeInstanceOf(HttpError);
    try {
      await statsService.get();
    } catch (e) {
      expect(e).toMatchObject({ status: 403 });
      expect((e as Error).message.length).toBeGreaterThan(3);
    }
  });

  it('keysService.create POST /keys', async () => {
    const fetchMock = installFetchMock([
      {
        match: '/admin/api/keys',
        method: 'POST',
        body: {
          data: { id: 'k2', name: 'n', plaintextKey: 'gk_x' },
        },
      },
    ]);
    const { keysService } = await import(
      '../../../../admin/src/services/keys.service'
    );
    await keysService.create({
      name: 'n',
      role: 'client',
      mode: 'safe',
      rateLimit: 60,
    });
    expect(lastFetchInit(fetchMock)!.method).toBe('POST');
  });

  it('documentsService.remove DELETE', async () => {
    const fetchMock = installFetchMock([
      {
        match: '/admin/api/documents/d1',
        method: 'DELETE',
        body: { deleted: true },
      },
    ]);
    const { documentsService } = await import(
      '../../../../admin/src/services/documents.service'
    );
    await documentsService.remove('d1');
    expect(lastFetchUrl(fetchMock)).toContain('/documents/d1');
  });
});
