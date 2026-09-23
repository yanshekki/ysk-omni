import { describe, expect, it } from 'vitest';
import {
  normalizeApiKeyMode,
  normalizeApiKeyRole,
} from '../../src/utils/role-normalize';
import { normalizeKeyRole } from '../../src/cli/lib/db-keys';

describe('API key role normalization', () => {
  it('maps legacy user → client for API', () => {
    expect(normalizeApiKeyRole('user')).toBe('client');
    expect(normalizeApiKeyRole('USER')).toBe('client');
    expect(normalizeApiKeyRole('client')).toBe('client');
    expect(normalizeApiKeyRole('admin')).toBe('admin');
  });

  it('CLI normalizeKeyRole accepts user alias (alias of shared util)', () => {
    expect(normalizeKeyRole('user')).toBe('client');
    expect(normalizeKeyRole('client')).toBe('client');
    expect(normalizeKeyRole('admin')).toBe('admin');
    expect(normalizeKeyRole(undefined)).toBe('client');
  });

  it('admin mode is always agent', () => {
    expect(normalizeApiKeyMode('admin', 'safe')).toBe('agent');
    expect(normalizeApiKeyMode('client', 'agent')).toBe('agent');
    expect(normalizeApiKeyMode('client', 'safe')).toBe('safe');
  });
});
