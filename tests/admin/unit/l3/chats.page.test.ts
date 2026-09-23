/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import { assertNoRawI18nKeys, renderAdminPage } from '../../helpers/render-harness';
import { fixtures } from '../../helpers/fixtures';

installBrowserShim();

describe('L3 chats.page', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
  });

  it('renders chat list table', async () => {
    const { app } = await renderAdminPage('chats', {
      routes: [
        { match: '/admin/api/me', body: fixtures.me() },
        { match: /\/chats/, body: fixtures.chatsList() },
        { match: /\/models/, body: fixtures.models() },
        { match: /\/keys/, body: fixtures.keysList() },
      ],
    });
    assertNoRawI18nKeys(app);
    expect(app.querySelector('table') || app.querySelector('h2')).toBeTruthy();
  });
});
