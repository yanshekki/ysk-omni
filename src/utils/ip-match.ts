/**
 * IPv4 exact / CIDR match helpers for API key whitelist and blacklist.
 * IPv6: exact match only (no CIDR).
 */

const IPV4_RE =
  /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
const CIDR_RE =
  /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\/(?:3[0-2]|[12]?\d)$/;

export function normalizeIp(ip: string): string {
  let s = ip.trim();
  // strip IPv4-mapped IPv6 ::ffff:x.x.x.x
  if (s.toLowerCase().startsWith('::ffff:')) {
    s = s.slice(7);
  }
  // strip brackets
  if (s.startsWith('[') && s.endsWith(']')) {
    s = s.slice(1, -1);
  }
  // Treat common loopback forms as 127.0.0.1 for matching
  if (s === '::1' || s === '0:0:0:0:0:0:0:1') {
    return '127.0.0.1';
  }
  return s;
}

/** Aliases that should match the same client (loopback). */
export function ipEquivalents(ip: string): string[] {
  const n = normalizeIp(ip);
  if (n === '127.0.0.1' || n === 'localhost') {
    return ['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost'];
  }
  return [n];
}

export function isValidIpOrCidr(entry: string): boolean {
  const s = normalizeIp(entry);
  if (!s) return false;
  if (IPV4_RE.test(s) || CIDR_RE.test(s)) return true;
  // loose IPv6 exact
  if (s.includes(':') && /^[0-9a-fA-F:.]+$/.test(s)) return true;
  return false;
}

function ipv4ToInt(ip: string): number {
  const parts = ip.split('.').map((x) => Number(x));
  return (
    ((parts[0]! << 24) >>> 0) +
    ((parts[1]! << 16) >>> 0) +
    ((parts[2]! << 8) >>> 0) +
    (parts[3]! >>> 0)
  );
}

function matchCidr(ip: string, cidr: string): boolean {
  const [base, bitsStr] = cidr.split('/');
  if (!base || !bitsStr || !IPV4_RE.test(ip) || !IPV4_RE.test(base)) return false;
  const bits = Number(bitsStr);
  if (!Number.isFinite(bits) || bits < 0 || bits > 32) return false;
  if (bits === 0) return true;
  const mask = bits === 32 ? 0xffffffff : (~0 << (32 - bits)) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(base) & mask);
}

/** True if clientIp matches any whitelist entry (exact or CIDR). Empty list = allow all. */
export function ipAllowed(clientIp: string, whitelist: string[] | null | undefined): boolean {
  if (!whitelist || whitelist.length === 0) return true;
  const candidates = ipEquivalents(clientIp);
  for (const ip of candidates) {
    for (const raw of whitelist) {
      const entry = normalizeIp(raw);
      if (!entry) continue;
      if (entry.includes('/')) {
        if (IPV4_RE.test(ip) && matchCidr(ip, entry)) return true;
      } else if (entry === ip || ipEquivalents(entry).includes(ip)) {
        return true;
      }
    }
  }
  return false;
}

/** True if client IP is exactly (or loopback-equivalent) in a ban set. */
export function ipMatchesExact(clientIp: string, bannedIp: string): boolean {
  const a = ipEquivalents(clientIp);
  const b = ipEquivalents(bannedIp);
  return a.some((x) => b.includes(x));
}

export function parseIpList(input: unknown): string[] {
  if (input == null) return [];
  if (Array.isArray(input)) {
    return input
      .map((x) => String(x).trim())
      .filter(Boolean)
      .filter(isValidIpOrCidr)
      .map(normalizeIp);
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) return parseIpList(parsed);
    } catch {
      /* lines / commas */
    }
    return trimmed
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter(isValidIpOrCidr)
      .map(normalizeIp);
  }
  return [];
}

export function serializeIpList(list: string[] | null | undefined): string | null {
  if (!list || list.length === 0) return null;
  return JSON.stringify(list);
}
