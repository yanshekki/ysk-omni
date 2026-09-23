/**
 * L3 sample: media page render (modular page registry).
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import { renderAdminPage } from '../../helpers/render-harness';
import { fixtures } from '../../helpers/fixtures';

installBrowserShim();

describe('L3 media.page', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
    document.body.innerHTML = '';
  });

  it('renders assets table and jobs panel with fixture data', async () => {
    const { app } = await renderAdminPage('media', {
      routes: [
        { match: '/admin/api/me', body: fixtures.me() },
        { match: /\/media\/assets/, method: 'GET', body: fixtures.mediaAssets() },
        { match: /\/media\/jobs/, method: 'GET', body: fixtures.mediaJobs() },
      ],
    });

    expect(app.querySelector('h2')?.textContent || '').toMatch(/media|媒體/i);
    const tables = app.querySelectorAll('table');
    expect(tables.length).toBeGreaterThanOrEqual(1);
    const text = app.textContent || '';
    expect(text).not.toMatch(/\bmedia\.empty\b/);
    expect(text).not.toMatch(/\berrors\.feature\./);
  });

  it('shows localized empty state when lists empty', async () => {
    const { app } = await renderAdminPage('media', {
      routes: [
        { match: '/admin/api/me', body: fixtures.me() },
        {
          match: /\/media\/assets/,
          method: 'GET',
          body: { object: 'list', total: 0, data: [] },
        },
        {
          match: /\/media\/jobs/,
          method: 'GET',
          body: { object: 'list', total: 0, data: [] },
        },
      ],
    });
    const text = app.textContent || '';
    expect(text.length).toBeGreaterThan(10);
    expect(text).not.toMatch(/\bmedia\.[a-zA-Z]+\b/);
  });
});
