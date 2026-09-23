import { describe, expect, it, vi, beforeEach } from 'vitest';
import { KEY_MODES } from '../../src/config/constants';

vi.mock('../../src/services/settings.service', () => ({
  settingsService: {
    getAll: vi.fn(async () => ({
      globalSafeMode: false,
      safeMaxTurns: 4,
      safeTimeoutMs: 120_000,
      safeToolsMode: 'none',
      defaultModel: 'grok-4.5',
      adminPanelEnabled: true,
    })),
  },
}));

import { policyService } from '../../src/services/policy.service';
import { settingsService } from '../../src/services/settings.service';

const baseKey = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 't',
  keyPrefix: 'gk_live_xxxx',
  role: 'client' as const,
  rateLimit: 60,
  isActive: true,
  maxTurns: null,
  timeoutMs: null,
};

describe('PolicyService', () => {
  beforeEach(() => {
    vi.mocked(settingsService.getAll).mockResolvedValue({
      globalSafeMode: false,
      safeMaxTurns: 4,
      safeTimeoutMs: 120_000,
      safeToolsMode: 'none',
      defaultModel: 'grok-4.5',
      adminPanelEnabled: true,
    });
  });

  it('safe mode disables alwaysApprove and forces sandbox', async () => {
    const policy = await policyService.resolve(
      { ...baseKey, mode: KEY_MODES.SAFE },
      '/tmp',
    );
    expect(policy.mode).toBe('safe');
    expect(policy.alwaysApprove).toBe(false);
    expect(policy.sandboxForced).toBe(true);
    expect(policy.cwd).toContain('sandboxes');
    expect(policy.toolsDenylist).toBeTruthy();
  });

  it('agent mode can alwaysApprove and uses allowlisted cwd', async () => {
    const policy = await policyService.resolve(
      { ...baseKey, mode: KEY_MODES.AGENT },
      undefined,
    );
    expect(policy.mode).toBe('agent');
    expect(policy.sandboxForced).toBe(false);
  });

  it('global safe mode downgrades agent keys', async () => {
    vi.mocked(settingsService.getAll).mockResolvedValue({
      globalSafeMode: true,
      safeMaxTurns: 2,
      safeTimeoutMs: 30_000,
      safeToolsMode: 'readonly',
      defaultModel: 'grok-4.5',
      adminPanelEnabled: true,
    });
    const policy = await policyService.resolve(
      { ...baseKey, mode: KEY_MODES.AGENT },
      undefined,
    );
    expect(policy.mode).toBe('safe');
    expect(policy.alwaysApprove).toBe(false);
    expect(policy.toolsAllowlist).toContain('read_file');
    expect(policy.maxTurns).toBe(2);
  });
});
