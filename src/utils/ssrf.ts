import { isIP } from 'node:net';
import { promises as dns } from 'node:dns';

const BLOCKED_HOSTS = new Set([
  'localhost',
  'localhost.localdomain',
  'ip6-localhost',
  'metadata.google.internal',
  'metadata.goog',
  'metadata',
]);

function ipv4Octets(ip: string): number[] | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return nums;
}

/** True when the address must not be fetched as a vision source. */
export function isBlockedIp(ip: string): boolean {
  const raw = ip.trim().toLowerCase().replace(/^\[|\]$/g, '');
  if (!raw) return true;

  if (raw.startsWith('::ffff:')) {
    return isBlockedIp(raw.slice(7));
  }

  const kind = isIP(raw);
  if (kind === 4) {
    const o = ipv4Octets(raw);
    if (!o) return true;
    const [a, b] = o;
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b! >= 16 && b! <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b! >= 64 && b! <= 127) return true;
    if (a === 198 && (b === 18 || b === 19)) return true;
    if (a! >= 224) return true;
    return false;
  }
  if (kind === 6) {
    if (raw === '::1' || raw === '::') return true;
    if (raw.startsWith('fc') || raw.startsWith('fd')) return true;
    if (raw.startsWith('fe8') || raw.startsWith('fe9') || raw.startsWith('fea') || raw.startsWith('feb')) {
      return true;
    }
    return false;
  }
  return false;
}

export function isBlockedHostname(hostname: string): boolean {
  const h = hostname.trim().toLowerCase().replace(/\.$/, '').replace(/^\[|\]$/g, '');
  if (!h) return true;
  if (BLOCKED_HOSTS.has(h) || h.endsWith('.localhost') || h.endsWith('.local')) {
    return true;
  }
  if (isIP(h) && isBlockedIp(h)) return true;
  return false;
}

export type ParsedVisionUrl = {
  href: string;
  hostname: string;
};

export function parsePublicHttpUrl(raw: string): ParsedVisionUrl {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new Error('invalid url');
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('non-http scheme');
  }
  if (u.username || u.password) {
    throw new Error('url credentials');
  }
  if (isBlockedHostname(u.hostname)) {
    throw new Error('blocked host');
  }
  return { href: u.href, hostname: u.hostname };
}

export async function assertResolvedPublicHost(
  hostname: string,
  lookup: typeof dns.lookup = dns.lookup,
): Promise<void> {
  if (isIP(hostname)) {
    if (isBlockedIp(hostname)) throw new Error('blocked ip');
    return;
  }
  const addrs = await lookup(hostname, { all: true, verbatim: true });
  const list = Array.isArray(addrs) ? addrs : [addrs];
  if (!list.length) throw new Error('dns empty');
  for (const a of list) {
    const addr = typeof a === 'string' ? a : a.address;
    if (isBlockedIp(addr)) throw new Error(`blocked resolved ip ${addr}`);
  }
}
