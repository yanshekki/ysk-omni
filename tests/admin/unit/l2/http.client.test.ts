import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import { installFetchMock, lastFetchInit, lastFetchUrl } from '../../helpers/mock-fetch';

installBrowserShim();

describe('admin http client L2', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
    sessionStorage.setItem('gog_admin_session', 'gog_sess_test');
  });

  it('apiGet attaches Bearer token', async () => {
    const fetchMock = installFetchMock([
      { match: '/admin/api/stats', body: { data: {} } },
    ]);
    const { apiGet } = await import('../../../../admin/src/lib/http');
    await apiGet('/stats');
    expect(lastFetchUrl(fetchMock)).toContain('/admin/api/stats');
    const h = lastFetchInit(fetchMock)!.headers as Record<string, string>;
    expect(h.Authorization).toMatch(/^Bearer /);
  });

  it('localizes feature_disabled videoApi via formatApiError', async () => {
    installFetchMock([
      {
        match: '/admin/api/media/videos',
        method: 'POST',
        status: 501,
        body: {
          error: {
            code: 'feature_disabled',
            message: 'Feature is disabled: videoApi',
            details: { feature: 'videoApi' },
          },
        },
      },
    ]);
    const { apiSend, HttpError } = await import('../../../../admin/src/lib/http');
    const { setLocale } = await import('../../../../admin/src/i18n');
    setLocale('en');
    await expect(
      apiSend('/media/videos', {
        method: 'POST',
        body: { prompt: 'x' },
      }),
    ).rejects.toBeInstanceOf(HttpError);
    try {
      await apiSend('/media/videos', {
        method: 'POST',
        body: { prompt: 'x' },
      });
    } catch (e) {
      expect((e as Error).message.toLowerCase()).toContain('video');
      expect((e as Error).message).not.toContain('Feature is disabled: videoApi');
    }
  });

  it('does not logout on media_forbidden 403', async () => {
    const { setToken } = await import('../../../../admin/src/state/store');
    setToken('gog_sess_keep');
    installFetchMock(
      [
        {
          match: '/admin/api/media/generate',
          method: 'POST',
          status: 403,
          body: {
            error: {
              code: 'media_forbidden',
              message: 'nope',
              details: { reason: 'agent_or_admin_required' },
            },
          },
        },
      ],
      'gog_sess_keep',
    );
    const { apiSend } = await import('../../../../admin/src/lib/http');
    await expect(
      apiSend('/media/generate', {
        method: 'POST',
        body: { prompt: 'x' },
      }),
    ).rejects.toBeTruthy();
    expect(sessionStorage.getItem('gog_admin_session')).toBe('gog_sess_keep');
  });
});
