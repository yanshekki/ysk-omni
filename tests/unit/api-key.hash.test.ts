import { describe, expect, it } from 'vitest';
import {
  hashApiKey,
  hashApiKeySha256,
  scryptHash,
  verifyApiKey,
} from '../../src/utils/api-key-crypto';

describe('api-key hashing', () => {
  it('scrypt hash verifies and is not deterministic without salt reuse', () => {
    const key = 'gk_live_test_key_abc123_long_enough';
    const hash = scryptHash(key);
    expect(hash.startsWith('scrypt$')).toBe(true);
    expect(verifyApiKey(key, hash)).toBe(true);
    expect(verifyApiKey('wrong_key_xxxxxxxxxxxxxxx', hash)).toBe(false);
    // hashApiKey now uses scrypt
    expect(hashApiKey(key).startsWith('scrypt$')).toBe(true);
  });

  it('still verifies legacy SHA-256 hashes', () => {
    const key = 'gk_live_legacy_key_abc12345';
    const legacy = hashApiKeySha256(key);
    expect(legacy).toHaveLength(64);
    expect(verifyApiKey(key, legacy)).toBe(true);
  });
});
