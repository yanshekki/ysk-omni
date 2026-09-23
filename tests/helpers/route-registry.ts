/**
 * Walk Express Router / Application stacks and collect method + path.
 * Used by registry tests so every mounted endpoint is enumerated.
 */
import type { Router } from 'express';

export type RouteEntry = {
  method: string;
  path: string;
};

function cleanPath(p: string): string {
  return (
    p
      .replace(/\\/g, '')
      .replace(/\/+/g, '/')
      .replace(/\/$/g, '') || '/'
  );
}

/**
 * Express 4 mount regexp → path prefix (best-effort).
 * e.g. /^\/v1\/chat\/?(?=\/|$)/i → /v1/chat
 */
function mountPathFromLayer(layer: {
  regexp?: RegExp;
  keys?: unknown[];
  path?: string;
}): string {
  if (typeof layer.path === 'string') return layer.path;
  const re = layer.regexp;
  if (!re) return '';
  // fast_slash mount at /
  if ((re as RegExp & { fast_slash?: boolean }).fast_slash) return '';
  const src = re.toString();
  // /^\/admin\/api\/?(?=\/|$)/i
  const m = src.match(/^\/\^((?:\\\/[^\\/?[+*(|]+)+)\\\/\?\(\?=\\\/\|\$\)\/i?\$?\/$/);
  if (m?.[1]) {
    return cleanPath(m[1].replace(/\\\//g, '/'));
  }
  // looser: pull \/segments
  const parts = src.match(/\\\/[A-Za-z0-9._:-]+/g);
  if (parts?.length) {
    return cleanPath(parts.map((s) => s.replace(/\\\//g, '/')).join(''));
  }
  return '';
}

/**
 * List routes on a Router (or nested).
 * @param router Express Router
 * @param basePath prefix already mounted (e.g. /admin/api)
 */
export function listRouterRoutes(router: Router, basePath = ''): RouteEntry[] {
  const out: RouteEntry[] = [];
  const stack = (router as unknown as { stack?: unknown[] }).stack || [];

  for (const raw of stack) {
    const layer = raw as {
      route?: {
        path: string | string[];
        methods: Record<string, boolean>;
      };
      name?: string;
      handle?: { stack?: unknown[] };
      regexp?: RegExp;
      keys?: unknown[];
      path?: string;
    };

    if (layer.route?.methods) {
      const paths = Array.isArray(layer.route.path)
        ? layer.route.path
        : [layer.route.path];
      for (const rp of paths) {
        const full = cleanPath(`${basePath}/${String(rp).replace(/^\//, '')}`);
        for (const [method, on] of Object.entries(layer.route.methods)) {
          if (on) {
            out.push({ method: method.toLowerCase(), path: full });
          }
        }
      }
      continue;
    }

    // Nested router
    if (layer.name === 'router' && layer.handle?.stack) {
      const mount = mountPathFromLayer(layer);
      const nextBase = cleanPath(`${basePath}${mount}`);
      out.push(
        ...listRouterRoutes(
          layer.handle as unknown as Router,
          nextBase === '/' ? '' : nextBase,
        ),
      );
    }
  }

  // de-dupe
  const seen = new Set<string>();
  return out.filter((r) => {
    const k = `${r.method} ${r.path}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function routeKey(r: RouteEntry): string {
  return `${r.method.toUpperCase()} ${r.path}`;
}

export function sortRoutes(routes: RouteEntry[]): RouteEntry[] {
  return [...routes].sort((a, b) => routeKey(a).localeCompare(routeKey(b)));
}

/** Paths that should not require a dedicated integration case yet (optional allowlist). */
export const ROUTE_REGISTRY_OPTIONAL: string[] = [
  // e.g. experimental
];
