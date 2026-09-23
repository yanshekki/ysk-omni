/**
 * Enumerate public/v1 Express routes and ensure coverage table is complete.
 */
import { describe, expect, it } from 'vitest';
import routes from '../../../src/routes/index';
import {
  listRouterRoutes,
  routeKey,
  sortRoutes,
} from '../../helpers/route-registry';

const V1_COVERAGE: Array<{
  method: string;
  path: string;
  coveredBy: string;
}> = [
  { method: 'get', path: '/health', coveredBy: 'health.routes' },
  { method: 'get', path: '/ready', coveredBy: 'health.routes' },
  { method: 'post', path: '/v1/chat/completions', coveredBy: 'v1.routes / tools-vision' },
  { method: 'get', path: '/v1/models', coveredBy: 'v1.routes' },
  { method: 'get', path: '/v1/models/:model', coveredBy: 'v1.routes' },
  { method: 'post', path: '/v1/documents', coveredBy: 'v1.routes' },
  { method: 'get', path: '/v1/documents', coveredBy: 'v1.routes' },
  { method: 'get', path: '/v1/documents/:id', coveredBy: 'v1.routes' },
  { method: 'delete', path: '/v1/documents/:id', coveredBy: 'v1.routes' },
  { method: 'post', path: '/v1/api-keys', coveredBy: 'v1.routes' },
  { method: 'get', path: '/v1/api-keys', coveredBy: 'v1.routes' },
  { method: 'delete', path: '/v1/api-keys/:id', coveredBy: 'v1.routes' },
  { method: 'post', path: '/v1/messages', coveredBy: 'v1.protocols' },
  { method: 'post', path: '/v1/responses', coveredBy: 'v1.protocols' },
  { method: 'get', path: '/v1/responses/:id', coveredBy: 'v1.protocols' },
  { method: 'delete', path: '/v1/responses/:id', coveredBy: 'v1.protocols' },
  { method: 'post', path: '/v1/assistants', coveredBy: 'v1.assistants' },
  { method: 'get', path: '/v1/assistants', coveredBy: 'v1.assistants' },
  { method: 'get', path: '/v1/assistants/:id', coveredBy: 'v1.assistants' },
  { method: 'delete', path: '/v1/assistants/:id', coveredBy: 'v1.assistants' },
  { method: 'post', path: '/v1/threads', coveredBy: 'v1.assistants' },
  { method: 'get', path: '/v1/threads/:id', coveredBy: 'v1.assistants' },
  { method: 'post', path: '/v1/threads/:threadId/messages', coveredBy: 'v1.assistants' },
  { method: 'get', path: '/v1/threads/:threadId/messages', coveredBy: 'v1.assistants' },
  { method: 'post', path: '/v1/threads/:threadId/runs', coveredBy: 'v1.assistants' },
  { method: 'post', path: '/v1/images/generations', coveredBy: 'v1.images / media-full' },
  { method: 'post', path: '/v1/images/edits', coveredBy: 'v1.images / media-full' },
  { method: 'get', path: '/v1/media/assets/:id', coveredBy: 'v1.images / media-full' },
  { method: 'get', path: '/v1/media/assets/:id/content', coveredBy: 'v1.images / media-full' },
  { method: 'post', path: '/v1/files', coveredBy: 'v1.media-full' },
  { method: 'get', path: '/v1/files', coveredBy: 'v1.media-full' },
  { method: 'get', path: '/v1/files/:id', coveredBy: 'v1.media-full' },
  { method: 'get', path: '/v1/files/:id/content', coveredBy: 'v1.media-full' },
  { method: 'delete', path: '/v1/files/:id', coveredBy: 'v1.media-full' },
  { method: 'post', path: '/v1/videos', coveredBy: 'v1.media-full' },
  { method: 'get', path: '/v1/videos/:id', coveredBy: 'v1.media-full' },
  { method: 'get', path: '/v1/videos/:id/content', coveredBy: 'v1.media-full' },
  { method: 'post', path: '/v1/audio/speech', coveredBy: 'v1.media-full' },
  { method: 'post', path: '/v1/audio/transcriptions', coveredBy: 'v1.media-full' },
];

describe('v1 + health routes registry', () => {
  const live = sortRoutes(listRouterRoutes(routes, ''));
  const coverageKeys = new Set(
    V1_COVERAGE.map((c) => routeKey({ method: c.method, path: c.path })),
  );

  it('enumerates public routes', () => {
    expect(live.length).toBeGreaterThan(10);
  });

  it('every live public route is listed in V1_COVERAGE', () => {
    const missing = live.filter((r) => !coverageKeys.has(routeKey(r)));
    if (missing.length) {
      expect.fail(
        `Uncovered public routes:\n${missing.map((r) => routeKey(r)).join('\n')}`,
      );
    }
  });

  it('V1_COVERAGE has no stale paths', () => {
    const liveKeys = new Set(live.map(routeKey));
    const stale = V1_COVERAGE.filter(
      (c) => !liveKeys.has(routeKey({ method: c.method, path: c.path })),
    );
    if (stale.length) {
      expect.fail(
        `Stale V1_COVERAGE:\n${stale.map((c) => routeKey(c)).join('\n')}`,
      );
    }
  });
});
