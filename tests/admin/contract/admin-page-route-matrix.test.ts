/**
 * Every Admin page primary path must exist on the Express admin router.
 */
import { describe, expect, it } from 'vitest';
import adminRoutes from '../../../src/routes/admin.routes';
import { pagePrimaryGetPath } from '../../../admin/src/pages/page-api';
import {
  NAV_ITEMS,
  PAGE_HASH,
  STATIC_NAV_PAGES,
} from '../../../admin/src/config/constants';
import { listRouterRoutes } from '../../helpers/route-registry';

describe('admin page ↔ route matrix', () => {
  const livePaths = new Set(
    listRouterRoutes(adminRoutes, '/admin/api').map((r) => r.path),
  );

  it('NAV_ITEMS covers all non-login pages in pagePrimaryGetPath', () => {
    for (const item of NAV_ITEMS) {
      if ((STATIC_NAV_PAGES as readonly string[]).includes(item.id)) continue;
      expect(pagePrimaryGetPath[item.id], item.id).toBeTruthy();
    }
  });

  it('PAGE_HASH maps to known page ids', () => {
    for (const [, page] of Object.entries(PAGE_HASH)) {
      expect(
        page === 'login' || NAV_ITEMS.some((n) => n.id === page),
      ).toBe(true);
    }
  });

  it('every pagePrimaryGetPath (except login) is mounted under /admin/api', () => {
    const missing: string[] = [];
    for (const [page, rel] of Object.entries(pagePrimaryGetPath)) {
      if (page === 'login') continue;
      const base = `/admin/api${rel.startsWith('/') ? rel : `/${rel}`}`;
      if (!livePaths.has(base)) {
        missing.push(`${page} → ${base}`);
      }
    }
    expect(missing, missing.join('\n')).toEqual([]);
  });

  it('login primary maps to auth login path', () => {
    expect(pagePrimaryGetPath.login).toBe('/auth/login');
    expect(livePaths.has('/admin/api/auth/login')).toBe(true);
  });
});
