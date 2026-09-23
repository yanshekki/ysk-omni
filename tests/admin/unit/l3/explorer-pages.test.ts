/**
 * L3: generic explorer pages (audit, settings, usage, ddos, queue, pm2, system, chat)
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installBrowserShim, resetSessionStore } from '../../helpers/browser-shim';
import {
  assertNoRawI18nKeys,
  defaultAdminRoutes,
  renderAdminPage,
} from '../../helpers/render-harness';
import { fixtures } from '../../helpers/fixtures';
import type { PageId } from '../../../../admin/src/config/constants';

installBrowserShim();

const EXPLORERS: Exclude<PageId, 'login'>[] = [
  'audit',
  'settings',
  'usage',
  'ddos',
  'queue',
  'pm2',
  'system',
];

describe('L3 explorer pages', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetSessionStore();
    vi.resetModules();
  });

  for (const page of EXPLORERS) {
    it(`${page} mounts with pre or panel`, async () => {
      const { app } = await renderAdminPage(page);
      expect(
        app.querySelector('h2') ||
          app.querySelector('pre') ||
          app.querySelector('.panel'),
      ).toBeTruthy();
      assertNoRawI18nKeys(app);
    });
  }

  it('chat playground mounts (smoke)', async () => {
    const { app } = await renderAdminPage('chat', {
      routes: [
        ...defaultAdminRoutes(),
        {
          match: /\/conversations/,
          body: { object: 'list', total: 0, data: [] },
        },
        { match: /\/documents/, body: fixtures.documentsList() },
        { match: /\/models/, body: fixtures.models() },
        { match: /\/keys/, body: fixtures.keysList() },
      ],
    });
    expect(app.innerHTML.length).toBeGreaterThan(50);
  });
});
