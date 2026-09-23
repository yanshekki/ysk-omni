/**
 * Regression: running server used stale dist without /media/* → Admin media page 404.
 * Fail CI/local if routes are not registered on the Express admin router.
 */
import { describe, expect, it } from 'vitest';
import adminRoutes from '../../src/routes/admin.routes';

function collectRoutes(router: {
  stack?: Array<{
    route?: { path?: string; methods?: Record<string, boolean> };
    name?: string;
    handle?: { stack?: unknown[] };
  }>;
}): Array<{ method: string; path: string }> {
  const out: Array<{ method: string; path: string }> = [];
  for (const layer of router.stack || []) {
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods || {}).filter(
        (m) => layer.route!.methods![m],
      );
      for (const m of methods) {
        out.push({ method: m.toUpperCase(), path: String(layer.route.path) });
      }
    }
  }
  return out;
}

describe('admin media routes registered', () => {
  const routes = collectRoutes(adminRoutes as never);
  const paths = routes.map((r) => `${r.method} ${r.path}`);

  it('registers GET /media/assets', () => {
    expect(paths).toContain('GET /media/assets');
  });

  it('registers GET /media/jobs', () => {
    expect(paths).toContain('GET /media/jobs');
  });

  it('registers asset detail / download / delete', () => {
    expect(paths).toContain('GET /media/assets/:id');
    expect(paths).toContain('GET /media/assets/:id/download');
    expect(paths).toContain('DELETE /media/assets/:id');
  });

  it('registers other high-traffic admin pages used by SPA', () => {
    // smoke: if these vanish, SPA pages 404 the same way media did
    for (const p of [
      'GET /stats',
      'GET /chats',
      'GET /keys',
      'GET /documents',
      'GET /api-features',
      'GET /usage',
      'GET /settings',
      'GET /audit-logs',
      'GET /system',
    ]) {
      expect(paths, `missing ${p}`).toContain(p);
    }
  });
});
