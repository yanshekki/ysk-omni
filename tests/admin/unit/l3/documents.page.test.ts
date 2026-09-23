/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import { assertNoRawI18nKeys, renderAdminPage } from '../../helpers/render-harness';

installBrowserShim();

describe('L3 documents.page', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
  });

  it('renders documents list', async () => {
    const { app } = await renderAdminPage('documents');
    assertNoRawI18nKeys(app);
    expect(app.querySelector('h2') || app.querySelector('table')).toBeTruthy();
  });
});
