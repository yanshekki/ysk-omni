import { PrismaClient } from '@prisma/client';
import {
  DEFAULT_PORT,
  resolveRuntimePaths,
} from '../lib/paths';
import { ensureEnvFile, loadEnvIntoProcess, readEnvFile } from '../lib/env-file';
import { fail, info, ok, warn } from '../lib/print';

/** Must match SETTING_KEYS.ADMIN_PANEL_ENABLED in constants */
const SETTING_KEY = 'admin_panel_enabled';

function openPrisma(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });
}

function parseBool(v: string | undefined, fallback: boolean): boolean {
  if (v === undefined) return fallback;
  return v === 'true' || v === '1';
}

async function readDbEnabled(
  databaseUrl: string,
  fallback: boolean,
): Promise<boolean> {
  const prisma = openPrisma(databaseUrl);
  try {
    const row = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
    return parseBool(row?.value, fallback);
  } finally {
    await prisma.$disconnect();
  }
}

async function writeDbEnabled(
  databaseUrl: string,
  enabled: boolean,
): Promise<void> {
  const prisma = openPrisma(databaseUrl);
  try {
    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      create: { key: SETTING_KEY, value: String(enabled) },
      update: { value: String(enabled) },
    });
  } finally {
    await prisma.$disconnect();
  }
}

function resolveOpts(opts: { home?: string; forceHome?: boolean }) {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);
  const file = readEnvFile(paths.envFile);
  const databaseUrl = file.DATABASE_URL || paths.databaseUrl;
  const envHard = parseBool(file.ADMIN_PANEL_ENABLED, true);
  const port = file.PORT || String(DEFAULT_PORT);
  return { paths, databaseUrl, envHard, port };
}

export async function cmdAdminStatus(opts: {
  home?: string;
  forceHome?: boolean;
}): Promise<void> {
  const { databaseUrl, envHard, port } = resolveOpts(opts);
  const dbEnabled = await readDbEnabled(databaseUrl, envHard);
  const effective = envHard && dbEnabled;

  info('Admin panel status');
  info(`  env ADMIN_PANEL_ENABLED: ${envHard}`);
  info(`  settings (DB) enabled:   ${dbEnabled}`);
  info(`  effective:               ${effective ? 'ON' : 'OFF'}`);
  info(`  URL:                     http://127.0.0.1:${port}/admin/`);
  if (!envHard) {
    warn('Env hard-off: set ADMIN_PANEL_ENABLED=true in .env and restart gateway.');
  } else if (!dbEnabled) {
    info('Tip: gctoac admin on');
  } else {
    ok('Admin panel is open');
  }
}

export async function cmdAdminOn(opts: {
  home?: string;
  forceHome?: boolean;
}): Promise<void> {
  const { databaseUrl, envHard, port } = resolveOpts(opts);
  if (!envHard) {
    fail('Cannot enable: ADMIN_PANEL_ENABLED=false in .env (hard off).');
    info('Fix: set ADMIN_PANEL_ENABLED=true in .env, then: gctoac restart');
    process.exitCode = 1;
    return;
  }
  await writeDbEnabled(databaseUrl, true);
  ok('Admin panel enabled (settings)');
  info(`Open: http://127.0.0.1:${port}/admin/`);
  info('No restart required for DB setting.');
}

export async function cmdAdminOff(opts: {
  home?: string;
  forceHome?: boolean;
}): Promise<void> {
  const { databaseUrl, port } = resolveOpts(opts);
  await writeDbEnabled(databaseUrl, false);
  ok('Admin panel disabled (settings)');
  info('API /v1 is unaffected.');
  info('Re-enable: gctoac admin on');
  info(`Was: http://127.0.0.1:${port}/admin/`);
}
