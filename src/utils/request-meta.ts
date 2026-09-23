/**
 * Shared HTTP request helpers for controllers (idempotency, headers).
 */
import type { Request } from 'express';

/** Read Idempotency-Key header (case-insensitive via Express). */
export function readIdempotencyKey(req: Request): string | undefined {
  const raw =
    req.header('idempotency-key') ||
    req.header('Idempotency-Key') ||
    undefined;
  if (!raw?.trim()) return undefined;
  return String(raw).trim().slice(0, 200);
}

/**
 * Scope an idempotency key to an API key id (prevents cross-tenant replay).
 */
export function scopedIdempotencyKey(
  apiKeyId: string,
  clientKey: string | undefined,
): string | undefined {
  if (!clientKey) return undefined;
  return `${apiKeyId}:${clientKey.slice(0, 200)}`;
}

export function readIdempotencyKeyScoped(
  req: Request,
  apiKeyId: string,
): string | undefined {
  return scopedIdempotencyKey(apiKeyId, readIdempotencyKey(req));
}
