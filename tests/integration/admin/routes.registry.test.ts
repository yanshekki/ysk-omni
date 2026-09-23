/**
 * Enumerate Admin Express routes and ensure each is listed in the coverage table.
 * Fail-first: missing coverage fails the suite so new endpoints require a test case.
 */
import { describe, expect, it } from 'vitest';
import adminRoutes from '../../../src/routes/admin.routes';
import {
  listRouterRoutes,
  routeKey,
  sortRoutes,
} from '../../helpers/route-registry';

/**
 * Coverage table: every admin route must appear here.
 * status/note documents how it is covered (integration file or dedicated unit).
 * When adding a route, add a row here AND a real hit test (or mark deferred with reason).
 */
const ADMIN_COVERAGE: Array<{
  method: string;
  path: string;
  coveredBy: string;
}> = [
  { method: 'post', path: '/admin/api/auth/login', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/auth/logout', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/me', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/chat/completions', coveredBy: 'admin.routes / playground' },
  { method: 'post', path: '/admin/api/documents', coveredBy: 'admin.routes.full / upload' },
  { method: 'get', path: '/admin/api/stats', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/usage', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/models', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/system', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/grok/inspect', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/grok/sessions', coveredBy: 'admin.routes.full' },
  { method: 'delete', path: '/admin/api/grok/sessions/:id', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/system/update-check', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/system/update', coveredBy: 'deferred-dangerous' },
  { method: 'get', path: '/admin/api/chats', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/chats/:id', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/conversations', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/conversations/:id', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/conversations', coveredBy: 'admin.routes.full' },
  { method: 'patch', path: '/admin/api/conversations/:id', coveredBy: 'admin.routes.full' },
  { method: 'delete', path: '/admin/api/conversations/:id', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/keys', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/keys', coveredBy: 'admin.routes.full' },
  { method: 'patch', path: '/admin/api/keys/:id', coveredBy: 'admin.routes.full' },
  { method: 'delete', path: '/admin/api/keys/:id', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/documents', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/documents/:id', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/documents/:id/download', coveredBy: 'admin.routes.full' },
  { method: 'delete', path: '/admin/api/documents/:id', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/audit-logs', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/settings', coveredBy: 'admin.routes.full' },
  { method: 'put', path: '/admin/api/settings', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/api-features', coveredBy: 'admin.routes.full' },
  { method: 'put', path: '/admin/api/api-features', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/api-features/preset', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/media/assets', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/media/assets/:id', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/media/assets/:id/download', coveredBy: 'admin.routes.full' },
  { method: 'delete', path: '/admin/api/media/assets/:id', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/media/jobs', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/media/generate', coveredBy: 'routes.hit-matrix' },
  { method: 'post', path: '/admin/api/media/edit', coveredBy: 'routes.hit-matrix' },
  { method: 'post', path: '/admin/api/media/videos', coveredBy: 'routes.hit-matrix' },
  { method: 'get', path: '/admin/api/ddos/connections', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/ddos/blacklist', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/ddos/stats', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/ddos/policy', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/ddos/events', coveredBy: 'admin.routes.full' },
  { method: 'put', path: '/admin/api/ddos/policy', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/ddos/policy/reset', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/ddos/blacklist', coveredBy: 'admin.routes.full' },
  { method: 'delete', path: '/admin/api/ddos/blacklist/:ip', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/pm2/status', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/pm2/start', coveredBy: 'deferred-dangerous' },
  { method: 'post', path: '/admin/api/pm2/stop', coveredBy: 'deferred-dangerous' },
  { method: 'post', path: '/admin/api/pm2/restart', coveredBy: 'deferred-dangerous' },
  { method: 'post', path: '/admin/api/pm2/reload', coveredBy: 'deferred-dangerous' },
  { method: 'get', path: '/admin/api/pm2/logs', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/pm2/logs/clear', coveredBy: 'deferred-dangerous' },
  { method: 'get', path: '/admin/api/pm2/config', coveredBy: 'admin.routes.full' },
  { method: 'put', path: '/admin/api/pm2/config', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/pm2/config/reset', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/pm2/switch', coveredBy: 'deferred-dangerous' },
  { method: 'get', path: '/admin/api/queue/stats', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/queue/jobs', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/queue/jobs/:id', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/queue/jobs/:id/cancel', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/queue/jobs/:id/requeue', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/queue/jobs/:id/priority', coveredBy: 'admin.routes.full' },
  { method: 'get', path: '/admin/api/queue/policy', coveredBy: 'admin.routes.full' },
  { method: 'put', path: '/admin/api/queue/policy', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/queue/pause', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/queue/resume', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/queue/drain', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/queue/undrain', coveredBy: 'admin.routes.full' },
  { method: 'post', path: '/admin/api/queue/purge-dead', coveredBy: 'admin.routes.full' },
];

describe('admin routes registry', () => {
  const live = sortRoutes(listRouterRoutes(adminRoutes, '/admin/api'));
  const coverageKeys = new Set(
    ADMIN_COVERAGE.map((c) => routeKey({ method: c.method, path: c.path })),
  );

  it('enumerates at least one admin route', () => {
    expect(live.length).toBeGreaterThan(20);
  });

  it('every live admin route is listed in ADMIN_COVERAGE', () => {
    const missing = live.filter((r) => !coverageKeys.has(routeKey(r)));
    if (missing.length) {
      const report = missing.map((r) => routeKey(r)).join('\n');
      expect.fail(
        `Uncovered admin routes (add to ADMIN_COVERAGE + a real test):\n${report}`,
      );
    }
  });

  it('ADMIN_COVERAGE has no stale paths (must exist on router)', () => {
    const liveKeys = new Set(live.map(routeKey));
    const stale = ADMIN_COVERAGE.filter(
      (c) => !liveKeys.has(routeKey({ method: c.method, path: c.path })),
    );
    if (stale.length) {
      const report = stale.map((c) => routeKey(c)).join('\n');
      expect.fail(`Stale ADMIN_COVERAGE entries (not on router):\n${report}`);
    }
  });

  it('exports route list snapshot size for docs', () => {
    // soft check: media studio endpoints present
    const keys = live.map(routeKey);
    expect(keys).toContain('POST /admin/api/media/generate');
    expect(keys).toContain('POST /admin/api/media/edit');
    expect(keys).toContain('POST /admin/api/media/videos');
  });
});
