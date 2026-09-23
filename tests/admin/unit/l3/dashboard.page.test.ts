/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import { assertNoRawI18nKeys, renderAdminPage } from '../../helpers/render-harness';

installBrowserShim();

describe('L3 dashboard.page', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
  });

  it('renders stats surface from fixtures', async () => {
    const { app } = await renderAdminPage('dashboard');
    assertNoRawI18nKeys(app);
    expect(app.querySelector('h2') || app.querySelector('.topbar')).toBeTruthy();
    expect((app.textContent || '').length).toBeGreaterThan(30);
  });
});
