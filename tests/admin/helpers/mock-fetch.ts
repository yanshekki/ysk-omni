import { expect, vi } from 'vitest';
import { KEY_STORAGE } from '../../../admin/src/config/constants';

export type MockRoute = {
  match: string | RegExp;
  method?: string;
  status?: number;
  body?: unknown;
  text?: string;
  headers?: Record<string, string>;
  blob?: Blob;
};

function urlOf(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

export function mockJsonResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

/**
 * Install fetch mock. First matching route wins.
 * Prefer method-specific routes before generic path matches.
 */
export function installFetchMock(
  routes: MockRoute[],
  token = 'gog_sess_test',
) {
  if (typeof sessionStorage !== 'undefined' && token) {
    sessionStorage.setItem(KEY_STORAGE, token);
  }

  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = urlOf(input);
      const method = (init?.method || 'GET').toUpperCase();

      for (const r of routes) {
        const methodOk = !r.method || r.method.toUpperCase() === method;
        const urlOk =
          typeof r.match === 'string'
            ? url.includes(r.match)
            : r.match.test(url);
        if (methodOk && urlOk) {
          if (r.blob) {
            return new Response(r.blob, {
              status: r.status ?? 200,
              headers: r.headers,
            });
          }
          if (r.text != null) {
            return new Response(r.text, { status: r.status ?? 200 });
          }
          return mockJsonResponse(r.body ?? {}, r.status ?? 200, r.headers);
        }
      }
      return mockJsonResponse(
        { error: { message: `No mock for ${method} ${url}` } },
        404,
      );
    },
  );

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export function lastFetchUrl(fetchMock: ReturnType<typeof vi.fn>): string {
  const call = fetchMock.mock.calls.at(-1);
  if (!call) return '';
  return urlOf(call[0] as RequestInfo | URL);
}

export function allFetchUrls(fetchMock: ReturnType<typeof vi.fn>): string[] {
  return fetchMock.mock.calls.map((call) =>
    urlOf(call[0] as RequestInfo | URL),
  );
}

export function lastFetchInit(
  fetchMock: ReturnType<typeof vi.fn>,
): RequestInit | undefined {
  return fetchMock.mock.calls.at(-1)?.[1] as RequestInit | undefined;
}

export function expectFetch(
  fetchMock: ReturnType<typeof vi.fn>,
  method: string,
  pathSubstring: string,
): RequestInit {
  const hit = fetchMock.mock.calls.find((call) => {
    const url = urlOf(call[0] as RequestInfo | URL);
    const m = ((call[1] as RequestInit | undefined)?.method || 'GET').toUpperCase();
    return m === method.toUpperCase() && url.includes(pathSubstring);
  });
  expect(hit, `expected ${method} …${pathSubstring}`).toBeTruthy();
  return (hit![1] as RequestInit) || {};
}

export function expectAuthBearer(init: RequestInit, tokenPart = 'Bearer '): void {
  const h = init.headers as Record<string, string> | undefined;
  expect(h?.Authorization || h?.authorization).toMatch(
    new RegExp(`^${tokenPart}`),
  );
}
