import type { Request } from 'express';
import type { ProxyIpConfig } from '../interfaces/proxy-ip-config.interface';
import type { ProxyIpSource } from '../interfaces/proxy-ip-source.type';
import {
  ipAllowed,
  isValidIpOrCidr,
  normalizeIp,
  parseIpList,
} from './ip-match';

export type { ProxyIpSource } from '../interfaces/proxy-ip-source.type';
export type { ProxyIpConfig } from '../interfaces/proxy-ip-config.interface';

/** Default: only local reverse proxies (same host) may inject IP headers. */
export const DEFAULT_TRUSTED_PROXIES = ['127.0.0.1', '::1'];

const DEFAULT_CFG: ProxyIpConfig = {
  trustHops: 1,
  source: 'auto',
  trustedProxies: [...DEFAULT_TRUSTED_PROXIES],
};

let runtimeCfg: ProxyIpConfig = {
  ...DEFAULT_CFG,
  trustedProxies: [...DEFAULT_TRUSTED_PROXIES],
};

export function getProxyIpConfig(): ProxyIpConfig {
  return runtimeCfg;
}

export function setProxyIpConfig(partial: Partial<ProxyIpConfig>): ProxyIpConfig {
  runtimeCfg = {
    trustHops: clampHops(
      partial.trustHops != null ? partial.trustHops : runtimeCfg.trustHops,
    ),
    source: normalizeSource(partial.source ?? runtimeCfg.source),
    trustedProxies: sanitizeTrusted(
      partial.trustedProxies !== undefined
        ? partial.trustedProxies
        : runtimeCfg.trustedProxies,
    ),
  };
  return runtimeCfg;
}

export function resetProxyIpConfig(cfg?: ProxyIpConfig): void {
  runtimeCfg = cfg
    ? {
        trustHops: clampHops(cfg.trustHops),
        source: normalizeSource(cfg.source),
        trustedProxies: sanitizeTrusted(cfg.trustedProxies),
      }
    : {
        ...DEFAULT_CFG,
        trustedProxies: [...DEFAULT_TRUSTED_PROXIES],
      };
}

function clampHops(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(0, Math.min(10, Math.floor(n)));
}

function normalizeSource(s: unknown): ProxyIpSource {
  const v = String(s || 'auto');
  if (
    v === 'cloudflare' ||
    v === 'nginx' ||
    v === 'x-forwarded-for' ||
    v === 'socket' ||
    v === 'auto'
  ) {
    return v;
  }
  return 'auto';
}

/** Reject world-open CIDRs that would enable IP header spoofing. */
function isOverlyBroadCidr(entry: string): boolean {
  const e = entry.trim().toLowerCase();
  return (
    e === '0.0.0.0/0' ||
    e === '::/0' ||
    e === '0.0.0.0' ||
    e === '::' ||
    e === '*'
  );
}

function sanitizeTrusted(list: string[] | undefined): string[] {
  const parsed = parseIpList(list ?? []).filter((e) => !isOverlyBroadCidr(e));
  if (!parsed.length) return [...DEFAULT_TRUSTED_PROXIES];
  // Always keep loopback as safe defaults alongside custom list
  const set = new Set([...DEFAULT_TRUSTED_PROXIES, ...parsed]);
  return [...set].filter(isValidIpOrCidr);
}

function header(req: Request, name: string): string {
  const raw = req.headers[name];
  if (!raw) return '';
  const v = Array.isArray(raw) ? raw[0] : raw;
  return String(v || '').trim();
}

function firstIpFromList(value: string): string {
  return value.split(',')[0]?.trim() || '';
}

/** TCP peer (immediate connection), never from headers. */
export function getSocketIp(req: Request): string {
  const socketRaw =
    req.socket?.remoteAddress ||
    (req.connection as { remoteAddress?: string } | undefined)?.remoteAddress ||
    '';
  return socketRaw ? normalizeIp(socketRaw) : '';
}

/**
 * True when the connecting peer is allowed to set client-IP headers.
 * Uses exact + CIDR match via ipAllowed.
 */
export function isTrustedProxyPeer(
  peerIp: string,
  trustedProxies?: string[],
): boolean {
  const list =
    trustedProxies && trustedProxies.length
      ? trustedProxies
      : runtimeCfg.trustedProxies;
  if (!peerIp || peerIp === 'unknown') return false;
  // ipAllowed: empty list = allow all — we never pass empty after sanitize
  return ipAllowed(peerIp, list.length ? list : DEFAULT_TRUSTED_PROXIES);
}

/** Prefer middleware-resolved clientIp; fall back to live resolve. */
export function requestIp(req: Request): string {
  if (req.clientIp) return req.clientIp;
  return getClientIp(req);
}

/**
 * Resolve client IP for rate-limit / ban / audit / DDoS.
 *
 * Security: proxy headers are ignored unless the TCP peer is in trustedProxies.
 * Untrusted peers always get the socket IP (cannot spoof CF-Connecting-IP etc.).
 */
export function getClientIp(
  req: Request,
  override?: Partial<ProxyIpConfig>,
): string {
  const cfg: ProxyIpConfig = {
    trustHops: clampHops(override?.trustHops ?? runtimeCfg.trustHops),
    source: normalizeSource(override?.source ?? runtimeCfg.source),
    trustedProxies: sanitizeTrusted(
      override?.trustedProxies ?? runtimeCfg.trustedProxies,
    ),
  };

  const socketIp = getSocketIp(req);
  if (!socketIp) return 'unknown';

  if (cfg.source === 'socket' || cfg.trustHops <= 0) {
    return socketIp;
  }

  // CRITICAL: never trust client-supplied IP headers from untrusted peers
  if (!isTrustedProxyPeer(socketIp, cfg.trustedProxies)) {
    return socketIp;
  }

  const pickHeader = (name: string): string | null => {
    const h = header(req, name);
    if (!h) return null;
    const ip = normalizeIp(firstIpFromList(h));
    return ip && ip !== 'unknown' ? ip : null;
  };

  // Cloudflare headers only when explicitly selected, or auto + CF-Ray
  // (nginx on loopback must not honor a client-injected CF-Connecting-IP).
  const looksLikeCloudflare = Boolean(header(req, 'cf-ray'));
  if (
    cfg.source === 'cloudflare' ||
    (cfg.source === 'auto' && looksLikeCloudflare)
  ) {
    const cf =
      pickHeader('cf-connecting-ip') || pickHeader('true-client-ip');
    if (cf) return cf;
  }

  // nginx X-Real-IP
  if (cfg.source === 'nginx' || cfg.source === 'auto') {
    const real = pickHeader('x-real-ip');
    if (real) return real;
  }

  // Express trust-proxy hop parsing of X-Forwarded-For
  if (
    cfg.source === 'x-forwarded-for' ||
    cfg.source === 'auto' ||
    cfg.source === 'nginx' ||
    cfg.source === 'cloudflare'
  ) {
    if (req.ip) {
      const fromExpress = normalizeIp(req.ip);
      if (fromExpress && fromExpress !== 'unknown') return fromExpress;
    }
    // Trusted peer only: take rightmost-1 style is Express job; if missing,
    // do NOT use leftmost (attacker-controlled). Prefer socket as last resort.
  }

  return socketIp;
}

/** Express `trust proxy` setting from hops count. */
export function expressTrustProxySetting(hops: number): boolean | number {
  const n = clampHops(hops);
  if (n <= 0) return false;
  return n;
}
