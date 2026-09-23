import {
  DEFAULT_PORT,
  resolveRuntimePaths,
} from '../lib/paths';
import { ensureEnvFile, loadEnvIntoProcess } from '../lib/env-file';
import {
  createKey,
  listKeys,
  revokeKey,
  getKey,
  updateKey,
  activateKey,
} from '../lib/db-keys';
import type { ApiKeyMode } from '../../interfaces';
import { normalizeApiKeyRole } from '../../utils/role-normalize';
import { fail, info, ok, warn } from '../lib/print';
import { emitJson, parseOnOff } from '../lib/runtime-context';

function printCreatedKey(
  key: {
    id: string;
    name: string;
    role: string;
    mode: string;
    rawKey: string;
    keyPrefix: string;
  },
  port: string | number,
): void {
  ok('API key created (store it securely — shown once):');
  info(`  id:     ${key.id}`);
  info(`  name:   ${key.name}`);
  info(`  role:   ${key.role}`);
  info(`  mode:   ${key.mode}`);
  info(`  prefix: ${key.keyPrefix}`);
  info(`  key:    ${key.rawKey}`);
  info('');
  info(`Admin:  http://127.0.0.1:${port}/admin/`);
  info(`Paste the key above into the Admin panel login.`);
  info('');
  info('Example:');
  info(
    `  curl -s http://127.0.0.1:${port}/admin/api/me -H "Authorization: Bearer ${key.rawKey}"`,
  );
}

export async function cmdKeyCreate(opts: {
  home?: string;
  forceHome?: boolean;
  name?: string;
  role?: string;
  mode?: string;
  rateLimit?: number;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);

  const role = normalizeApiKeyRole(opts.role);
  const mode: ApiKeyMode = opts.mode === 'agent' ? 'agent' : 'safe';
  const databaseUrl = env.DATABASE_URL || paths.databaseUrl;
  const port = env.PORT || DEFAULT_PORT;

  const key = await createKey({
    databaseUrl,
    name: opts.name,
    role,
    mode,
    rateLimit: opts.rateLimit,
  });

  printCreatedKey(key, port);
}

export async function cmdKeyList(opts: {
  home?: string;
  forceHome?: boolean;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);
  const databaseUrl = env.DATABASE_URL || paths.databaseUrl;

  const keys = await listKeys(databaseUrl);
  if (keys.length === 0) {
    warn('No API keys. Create one: gctoac key create');
    return;
  }

  info(
    `${'id'.padEnd(38)} ${'role'.padEnd(7)} ${'mode'.padEnd(7)} ${'active'.padEnd(7)} ${'prefix'.padEnd(18)} name`,
  );
  for (const k of keys) {
    info(
      `${k.id.padEnd(38)} ${k.role.padEnd(7)} ${k.mode.padEnd(7)} ${String(k.isActive).padEnd(7)} ${k.keyPrefix.padEnd(18)} ${k.name}`,
    );
  }
  info('');
  info('Plaintext keys are not stored. Create a new one: gctoac key create');
}

export async function cmdKeyRevoke(opts: {
  home?: string;
  forceHome?: boolean;
  id: string;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);
  const databaseUrl = env.DATABASE_URL || paths.databaseUrl;

  const okRevoke = await revokeKey(databaseUrl, opts.id);
  if (!okRevoke) {
    fail(`Key not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  ok(`Revoked key ${opts.id}`);
}

export async function cmdKeyShow(opts: {
  home?: string;
  forceHome?: boolean;
  id: string;
  json?: boolean;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);
  const databaseUrl = env.DATABASE_URL || paths.databaseUrl;
  const key = await getKey(databaseUrl, opts.id);
  if (!key) {
    fail(`Key not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  if (opts.json) {
    emitJson(key);
    return;
  }
  info(`API key ${key.id}`);
  info(`  name:       ${key.name}`);
  info(`  role:       ${key.role}`);
  info(`  mode:       ${key.mode}`);
  info(`  active:     ${key.isActive}`);
  info(`  rateLimit:  ${key.rateLimit}`);
  info(`  prefix:     ${key.keyPrefix}`);
  info(`  createdAt:  ${key.createdAt.toISOString()}`);
  info(`  lastUsedAt: ${key.lastUsedAt?.toISOString() ?? '—'}`);
}

export async function cmdKeyUpdate(opts: {
  home?: string;
  forceHome?: boolean;
  id: string;
  name?: string;
  role?: string;
  mode?: string;
  rateLimit?: number;
  active?: string;
  json?: boolean;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);
  const databaseUrl = env.DATABASE_URL || paths.databaseUrl;

  let isActive: boolean | undefined;
  try {
    if (opts.active !== undefined) isActive = parseOnOff(opts.active);
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
    return;
  }

  const mode: ApiKeyMode | undefined =
    opts.mode === undefined
      ? undefined
      : opts.mode === 'agent'
        ? 'agent'
        : 'safe';

  if (
    opts.name === undefined &&
    opts.role === undefined &&
    mode === undefined &&
    opts.rateLimit === undefined &&
    isActive === undefined
  ) {
    fail('No fields to update. Use --name/--role/--mode/--rate-limit/--active');
    process.exitCode = 1;
    return;
  }

  const key = await updateKey(databaseUrl, opts.id, {
    name: opts.name,
    role: opts.role,
    mode,
    rateLimit: opts.rateLimit,
    isActive,
  });
  if (!key) {
    fail(`Key not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  ok(`Updated key ${key.id}`);
  if (opts.json) emitJson(key);
  else {
    info(
      `  ${key.name} · ${key.role}/${key.mode} · active=${key.isActive} · rate=${key.rateLimit}`,
    );
  }
}

export async function cmdKeyActivate(opts: {
  home?: string;
  forceHome?: boolean;
  id: string;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);
  const databaseUrl = env.DATABASE_URL || paths.databaseUrl;
  const okAct = await activateKey(databaseUrl, opts.id);
  if (!okAct) {
    fail(`Key not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  ok(`Activated key ${opts.id}`);
}
