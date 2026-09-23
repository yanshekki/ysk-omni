/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import { assertNoRawI18nKeys, renderAdminPage } from '../../helpers/render-harness';

installBrowserShim();

describe('L3 api-features.page', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
  });

  it('renders feature toggles surface', async () => {
    const { app } = await renderAdminPage('apiFeatures');
    assertNoRawI18nKeys(app);
    const text = (app.textContent || '').toLowerCase();
    expect(text).toMatch(/api|feature|tools|images|能力/);
  });
});
