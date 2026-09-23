/**
 * How to resolve the real client IP when behind reverse proxies.
 * Headers (CF / X-Real-IP / XFF) are ONLY trusted when the TCP peer
 * is in `trustedProxies` (default: loopback). Otherwise socket IP is used.
 */
export type ProxyIpSource =
  | 'auto'
  | 'cloudflare'
  | 'nginx'
  | 'x-forwarded-for'
  | 'socket';
