/**
 * API key secret generation + hashing (shared by HTTP API + CLI).
 * Prefer scrypt for new keys; SHA-256 remains verifiable for legacy rows.
 */
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { API_KEY_PREFIX } from '../config/constants';

export function createApiKeySecret(): string {
  return `${API_KEY_PREFIX}${randomBytes(24).toString('base64url')}`;
}

export function apiKeyPrefix(rawKey: string): string {
  return rawKey.slice(0, 16);
}

/** Legacy: plain SHA-256 hex (64 chars). */
export function hashApiKeySha256(rawKey: string): string {
  return createHash('sha256').update(rawKey, 'utf8').digest('hex');
}

/** Preferred: scrypt$saltHex$hashHex */
export function scryptHash(rawKey: string, salt = randomBytes(16)): string {
  const hash = scryptSync(rawKey, salt, 32);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

/** New keys: scrypt. */
export function hashApiKey(rawKey: string): string {
  return scryptHash(rawKey);
}

export function verifyApiKey(rawKey: string, keyHash: string): boolean {
  try {
    if (keyHash.startsWith('scrypt$')) {
      const parts = keyHash.split('$');
      if (parts.length !== 3) return false;
      const salt = Buffer.from(parts[1]!, 'hex');
      const expected = Buffer.from(parts[2]!, 'hex');
      const actual = scryptSync(rawKey, salt, expected.length);
      return timingSafeEqual(actual, expected);
    }
    const computed = hashApiKeySha256(rawKey);
    return timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(keyHash, 'hex'),
    );
  } catch {
    return false;
  }
}
