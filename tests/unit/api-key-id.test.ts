import { describe, expect, it } from 'vitest';
import {
  isSyntheticApiKeyId,
  toAuditApiKeyId,
} from '../../src/utils/api-key-id';

describe('api-key-id helpers', () => {
  it('detects OTP session and non-uuid ids as synthetic', () => {
    expect(isSyntheticApiKeyId('admin-session:abc')).toBe(true);
    expect(isSyntheticApiKeyId('otp_sess')).toBe(true);
    expect(isSyntheticApiKeyId('not-a-uuid')).toBe(true);
    expect(isSyntheticApiKeyId(null)).toBe(true);
    expect(isSyntheticApiKeyId(undefined)).toBe(true);
    expect(
      isSyntheticApiKeyId('550e8400-e29b-41d4-a716-446655440000'),
    ).toBe(false);
  });

  it('toAuditApiKeyId nulls synthetic ids', () => {
    expect(toAuditApiKeyId('admin-session:xyz')).toBeNull();
    expect(
      toAuditApiKeyId('550e8400-e29b-41d4-a716-446655440000'),
    ).toBe('550e8400-e29b-41d4-a716-446655440000');
  });
});
