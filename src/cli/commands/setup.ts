import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  ensureHomeDirs,
  resolveRuntimePaths,
  DEFAULT_PORT,
} from '../lib/paths';
import { ensureEnvFile } from '../lib/env-file';
import { runPrisma } from '../lib/run-prisma';
import { seedAdmin } from '../lib/seed-admin';
import { baseUrls, info, ok, warn } from '../lib/print';

export async function cmdSetup(opts: {
  home?: string;
  port?: number;
  forceHome?: boolean;
}): Promise<void> {
  const port = opts.port ?? DEFAULT_PORT;
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });

  info(`Mode: ${paths.mode}`);
  info(`Home: ${paths.home}`);
  ensureHomeDirs(paths);
  const env = ensureEnvFile(paths, port);

  const databaseUrl = env.DATABASE_URL || paths.databaseUrl;
  const runEnv = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    ENCRYPTION_KEY: env.ENCRYPTION_KEY,
    PORT: env.PORT || String(port),
  };

  try {
    info('Ensuring pm2 is installed (for Admin PM2 control)…');
    execSync('npm install -g pm2', {
      stdio: 'inherit',
      env: process.env,
    });
    ok('pm2 ready');
  } catch {
    warn('pm2 install skipped/failed — run: npm install -g pm2');
  }

  info('Running prisma migrate deploy…');
  runPrisma(['migrate', 'deploy'], {
    cwd: paths.packageRoot,
    packageRoot: paths.packageRoot,
    env: runEnv,
  });

  info('Running seed…');
  try {
    await seedAdmin({
      databaseUrl,
      bootstrapKey: env.ADMIN_BOOTSTRAP_KEY,
      port: env.PORT || port,
    });
  } catch (err) {
    warn(`Seed failed: ${err instanceof Error ? err.message : String(err)}`);
    warn('Retry with: gctoac seed');
  }

  const urls = baseUrls(Number(env.PORT || port));
  ok('Setup complete');
  info('');
  info(`  API:   ${urls.api}`);
  info(`  Admin: ${urls.admin}`);
  info(`  Env:   ${paths.envFile}`);
  info(`  DB:    ${path.join(paths.dataDir, 'gateway.db')}`);
  info('');
  info('Next: gctoac start');
}
