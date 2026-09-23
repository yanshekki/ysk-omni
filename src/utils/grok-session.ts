import { createHash } from 'node:crypto';

/** DNS namespace UUID (RFC 4122) — stable seed for per-key session ids. */
const UUID_V5_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value.trim());
}

function parseUuidBytes(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}

function formatUuid(bytes: Buffer): string {
  const h = bytes.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

/** RFC 4122 UUID v5 (SHA-1 name-based). */
export function uuidV5(name: string, namespace = UUID_V5_NAMESPACE): string {
  const hash = createHash('sha1')
    .update(parseUuidBytes(namespace))
    .update(name, 'utf8')
    .digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x50;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  return formatUuid(bytes);
}

/**
 * Deterministic Grok CLI session UUID for a tenant + client session id.
 * Grok 1.0+ requires `-s` to be a UUID and only accepts it on first create.
 */
export function namespacedGrokSessionId(
  apiKeyId: string,
  clientSessionId: string,
): string {
  const raw = clientSessionId.trim().slice(0, 128);
  return uuidV5(`gctoac:${apiKeyId}:${raw}`);
}

export type GrokSessionCliMode = 'create' | 'resume';

export type ResolvedGrokSession = {
  mode: GrokSessionCliMode;
  grokSessionId: string;
};

/**
 * Decide create (`-s`) vs resume (`--resume`) for a client `session_id`.
 * `knownGrokSessionId` comes from a persisted alias row.
 */
export function resolveGrokSessionBinding(input: {
  apiKeyId: string;
  clientSessionId: string;
  knownGrokSessionId?: string | null;
  knownByGrokId?: string | null;
}): ResolvedGrokSession {
  if (input.knownGrokSessionId && isUuid(input.knownGrokSessionId)) {
    return { mode: 'resume', grokSessionId: input.knownGrokSessionId };
  }
  if (input.knownByGrokId && isUuid(input.knownByGrokId)) {
    return { mode: 'resume', grokSessionId: input.knownByGrokId };
  }
  return {
    mode: 'create',
    grokSessionId: namespacedGrokSessionId(
      input.apiKeyId,
      input.clientSessionId,
    ),
  };
}

export function isSessionAlreadyExistsError(err: unknown): boolean {
  const parts: string[] = [];
  if (typeof err === 'string') parts.push(err);
  if (err instanceof Error) parts.push(err.message);
  if (err && typeof err === 'object' && 'details' in err) {
    const d = (err as { details?: unknown }).details;
    if (typeof d === 'string') parts.push(d);
    else if (d && typeof d === 'object') {
      const rec = d as Record<string, unknown>;
      if (typeof rec.stderr === 'string') parts.push(rec.stderr);
      if (typeof rec.message === 'string') parts.push(rec.message);
    }
  }
  const m = parts.join('\n').toLowerCase();
  return (
    m.includes('already in use') ||
    m.includes('already exist') ||
    m.includes('must not already exist')
  );
}
