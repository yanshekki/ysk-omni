/**
 * L3 page render harness (happy-dom environment).
 */
import { vi } from 'vitest';
import type { MockRoute } from './mock-fetch';
import { installFetchMock } from './mock-fetch';
import { fixtures } from './fixtures';
import { KEY_STORAGE } from '../../../admin/src/config/constants';
import type { PageId } from '../../../admin/src/config/constants';
import type { AppState } from '../../../admin/src/types/state';

export function defaultAdminRoutes(): MockRoute[] {
  return [
    { match: '/admin/api/me', body: fixtures.me() },
    { match: '/admin/api/stats', body: fixtures.stats() },
    { match: '/admin/api/chats', body: fixtures.chatsList() },
    { match: '/admin/api/keys', body: fixtures.keysList() },
    { match: '/admin/api/documents', body: fixtures.documentsList() },
    { match: /\/media\/assets/, method: 'GET', body: fixtures.mediaAssets() },
    { match: /\/media\/jobs/, method: 'GET', body: fixtures.mediaJobs() },
    { match: '/admin/api/api-features', method: 'GET', body: fixtures.apiFeatures() },
    { match: '/admin/api/api-features', method: 'PUT', body: fixtures.apiFeatures() },
    { match: '/admin/api/api-features/preset', method: 'POST', body: fixtures.apiFeatures() },
    { match: '/admin/api/usage', body: fixtures.usage() },
    { match: '/admin/api/models', body: fixtures.models() },
    { match: '/admin/api/audit-logs', body: fixtures.audit() },
    { match: '/admin/api/settings', body: fixtures.settings() },
    { match: '/admin/api/system', body: fixtures.system() },
    { match: '/admin/api/ddos', body: fixtures.ddos() },
    { match: '/admin/api/queue', body: fixtures.queue() },
    { match: '/admin/api/pm2', body: fixtures.pm2() },
    {
      match: '/admin/api/auth/login',
      method: 'POST',
      body: fixtures.authLogin(),
    },
  ];
}

export async function mountApp(): Promise<HTMLElement> {
  document.body.innerHTML = '<div id="app"></div>';
  const app = document.getElementById('app');
  if (!app) throw new Error('#app missing');
  return app;
}

export async function renderAdminPage(
  page: Exclude<PageId, 'login'>,
  opts: {
    routes?: MockRoute[];
    token?: string;
    state?: Partial<AppState>;
  } = {},
) {
  const token = opts.token ?? 'gog_sess_test';
  sessionStorage.setItem(KEY_STORAGE, token);

  const fetchMock = installFetchMock(
    opts.routes ?? defaultAdminRoutes(),
    token,
  );

  // Dynamic import after globals ready
  const { patchState } = await import('../../../admin/src/state/store');
  const { pageRegistry } = await import('../../../admin/src/router');

  patchState({
    key: token,
    page,
    me: {
      id: 'admin-session:u1',
      name: 'Admin',
      role: 'admin',
      mode: 'agent',
    },
    error: '',
    modal: null,
    ...(opts.state || {}),
  });

  await mountApp();
  const ctx = { rerender: vi.fn() };
  const render = pageRegistry[page];
  if (!render) throw new Error(`No page ${page}`);
  await render(ctx);
  return {
    app: document.getElementById('app')!,
    fetchMock,
    ctx,
  };
}

export async function renderLoginPage(opts: { routes?: MockRoute[] } = {}) {
  sessionStorage.removeItem(KEY_STORAGE);
  const fetchMock = installFetchMock(
    opts.routes ?? defaultAdminRoutes(),
    '',
  );
  const { patchState } = await import('../../../admin/src/state/store');
  const { renderLoginPage: render } = await import(
    '../../../admin/src/pages/login.page'
  );
  patchState({ key: '', page: 'login', me: null, error: '' });
  await mountApp();
  await render();
  return { app: document.getElementById('app')!, fetchMock };
}

/** Assert no raw i18n key paths like `chats.empty` in visible text */
export function assertNoRawI18nKeys(root: HTMLElement): void {
  const text = root.textContent || '';
  // Allow version-like strings; flag dotted translation keys commonly leaked
  const leak = text.match(
    /\b(chats|docs|keys|media|dash|nav|common|apiFeatures)\.[a-zA-Z]{2,}\b/,
  );
  if (leak) {
    throw new Error(`Raw i18n key visible in DOM: ${leak[0]}`);
  }
}
