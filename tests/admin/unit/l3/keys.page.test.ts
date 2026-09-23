/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import { assertNoRawI18nKeys, renderAdminPage } from '../../helpers/render-harness';

installBrowserShim();

describe('L3 keys.page', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
  });

  it('renders keys list', async () => {
    const { app } = await renderAdminPage('keys');
    assertNoRawI18nKeys(app);
    expect(app.querySelector('h2') || app.querySelector('table')).toBeTruthy();
  });
});
