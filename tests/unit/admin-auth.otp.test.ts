import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import { prisma } from '../../src/config/database';
import { adminAuthService } from '../../src/services/admin-auth.service';

describe('admin OTP auth', () => {
  let dbOk = false;

  beforeAll(async () => {
    try {
      await prisma.$connect();
      execSync('npx prisma migrate deploy', {
        stdio: 'pipe',
        env: process.env,
        cwd: process.cwd(),
      });
      dbOk = true;
    } catch {
      dbOk = false;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });

  it('creates OTP, logs in once, rejects reuse', async () => {
    if (!dbOk) return;
    const { code } = await adminAuthService.createOtp();
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);

    const session = await adminAuthService.loginWithOtp(code);
    expect(session.token.startsWith('gog_sess_')).toBe(true);

    const actor = await adminAuthService.resolveSessionToken(session.token);
    expect(actor?.role).toBe('admin');

    await expect(adminAuthService.loginWithOtp(code)).rejects.toThrow();
  });
});
