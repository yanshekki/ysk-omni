import { beforeAll, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import { prisma } from '../../src/config/database';
import { apiFeaturesService } from '../../src/services/api-features.service';
import { DEFAULT_API_FEATURES } from '../../src/interfaces/api-features.type';

describe('apiFeaturesService', () => {
  let dbOk = false;

  beforeAll(async () => {
    try {
      await prisma.$connect();
      execSync('npx prisma@6.5.0 migrate deploy', {
        stdio: 'pipe',
        env: process.env,
        cwd: process.cwd(),
        timeout: 60_000,
      });
      dbOk = true;
    } catch {
      dbOk = false;
    }
  }, 90_000);

  it('loads defaults and can update + preset', async () => {
    if (!dbOk) return;
    const open = await apiFeaturesService.applyPreset('open');
    expect(open.openaiChat).toBe(true);
    expect(open.tools).toBe(DEFAULT_API_FEATURES.tools);

    const locked = await apiFeaturesService.applyPreset('locked');
    expect(locked.tools).toBe(false);
    expect(locked.strictSampling).toBe(true);

    await apiFeaturesService.update({ tools: true });
    const mid = await apiFeaturesService.get();
    expect(mid.tools).toBe(true);

    // restore
    await apiFeaturesService.applyPreset('open');
  });

  it('assertEnabled throws when disabled', async () => {
    if (!dbOk) return;
    await apiFeaturesService.update({ openaiChat: false });
    await expect(apiFeaturesService.assertEnabled('openaiChat')).rejects.toThrow(
      /disabled/i,
    );
    await apiFeaturesService.applyPreset('open');
  });
});
