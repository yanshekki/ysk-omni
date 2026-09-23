import {
  DEFAULT_PORT,
  resolveRuntimePaths,
} from '../lib/paths';
import { ensureEnvFile, loadEnvIntoProcess } from '../lib/env-file';
import { fail, info, ok, warn } from '../lib/print';

/**
 * Generate a one-time Admin panel login code (CLI only).
 * Requires the gateway process to share the same DATABASE_URL.
 */
export async function cmdAdminOtp(opts: {
  home?: string;
  forceHome?: boolean;
  port?: number;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const envMap = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);

  // Point Prisma at the same DB as the running gateway
  if (envMap.DATABASE_URL) {
    process.env.DATABASE_URL = envMap.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = paths.databaseUrl;
  }

  // Lazy import after env is set
  const { adminAuthService } = await import('../../services/admin-auth.service');
  const { disconnectDatabase } = await import('../../config/database');

  try {
    const { code, expiresAt } = await adminAuthService.createOtp();
    const port = opts.port || Number(envMap.PORT || DEFAULT_PORT);
    ok('One-time Admin login code (valid 5 minutes, single use):');
    info('');
    info(`  ${code}`);
    info('');
    info(`Expires: ${expiresAt.toISOString()}`);
    info(`Admin:   http://127.0.0.1:${port}/admin/`);
    info('');
    info('Paste the code on the Admin login page. Do not share it.');
    warn('A new code is required for every login.');
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
  } finally {
    await disconnectDatabase().catch(() => undefined);
  }
}
