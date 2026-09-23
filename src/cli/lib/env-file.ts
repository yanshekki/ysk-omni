import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import type { RuntimePaths } from './paths';
import { DEFAULT_PORT } from './paths';

export function readEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

export function writeEnvFile(filePath: string, vars: Record<string, string>): void {
  const lines = Object.entries(vars).map(([k, v]) => {
    const needsQuote = /[\s#"'\\]/.test(v) || v.includes('=');
    return needsQuote
      ? `${k}="${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
      : `${k}=${v}`;
  });
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join('\n') + '\n', { mode: 0o600 });
}

export function upsertEnvFile(
  filePath: string,
  updates: Record<string, string>,
): Record<string, string> {
  const current = readEnvFile(filePath);
  const next = { ...current, ...updates };
  writeEnvFile(filePath, next);
  return next;
}

/** Defaults for newly introduced keys (never overwrite existing user values). */
function modernEnvDefaults(port: number): Record<string, string> {
  return {
    // Installable default; local dev can set NODE_ENV=development explicitly
    NODE_ENV: 'production',
    HOST: '0.0.0.0',
    RATE_LIMIT_WINDOW_MS: '60000',
    RATE_LIMIT_MAX: '120',
    RATE_LIMIT_IP_MAX: '60',
    CHAT_BURST_MAX: '20',
    BLOCK_FAILED_AUTH_THRESHOLD: '20',
    BLOCK_FAILED_AUTH_WINDOW_MS: '300000',
    BLOCK_DURATION_MS: '600000',
    BODY_LIMIT: '1mb',
    UPLOAD_MAX_BYTES: '10485760',
    DOCUMENT_DB_MAX_BYTES: '1048576',
    LOG_LEVEL: 'info',
    // hops: 0=off, 1=nginx/CF→app, 2=CF→nginx→app (true/false still accepted by server)
    TRUST_PROXY: '1',
    PROXY_IP_SOURCE: 'auto',
    PM2_ADMIN_ENABLED: 'true',
    ADMIN_PANEL_ENABLED: 'true',
    CORS_ORIGINS: `http://localhost:${port},http://127.0.0.1:${port}`,
  };
}

/**
 * Ensure .env exists. Backfills missing keys from modern defaults without
 * clobbering user-set values. Critical paths (DATABASE_URL, STORAGE_DIR) always
 * aligned to runtime paths.
 */
export function ensureEnvFile(
  paths: RuntimePaths,
  port = DEFAULT_PORT,
): Record<string, string> {
  const existing = readEnvFile(paths.envFile);
  if (Object.keys(existing).length > 0 && existing.ENCRYPTION_KEY) {
    const p = Number(existing.PORT || port) || port;
    const fill: Record<string, string> = {};
    const defaults = modernEnvDefaults(p);
    for (const [k, v] of Object.entries(defaults)) {
      if (existing[k] === undefined || existing[k] === '') {
        fill[k] = v;
      }
    }
    // Always keep runtime paths consistent
    fill.DATABASE_URL = paths.databaseUrl;
    fill.STORAGE_DIR = paths.storageDir;
    if (!existing.PORT) fill.PORT = String(port);
    return upsertEnvFile(paths.envFile, fill);
  }

  const encryptionKey = randomBytes(32).toString('base64');
  const vars: Record<string, string> = {
    NODE_ENV: 'production',
    PORT: String(port),
    DATABASE_URL: paths.databaseUrl,
    ENCRYPTION_KEY: encryptionKey,
    GROK_BIN: 'grok',
    GROK_DEFAULT_MODEL: 'grok-4.6',
    GROK_DEFAULT_CWD: `${paths.home.replace(/\\/g, '/')}/workspaces/default`,
    GROK_CWD_ALLOWLIST: `${paths.home.replace(/\\/g, '/')}/workspaces`,
    GROK_TIMEOUT_MS: '600000',
    GROK_MAX_CONCURRENT: '4',
    GROK_ALWAYS_APPROVE: 'true',
    GROK_SAFE_MODE: 'false',
    GROK_SAFE_MAX_TURNS: '4',
    GROK_SAFE_TIMEOUT_MS: '120000',
    STORAGE_DIR: paths.storageDir,
    ...modernEnvDefaults(port),
  };
  writeEnvFile(paths.envFile, vars);
  return vars;
}

/** Persist PORT (and soft-update CORS localhost entries). */
export function setEnvPort(
  filePath: string,
  port: number,
): Record<string, string> {
  const cur = readEnvFile(filePath);
  const previous = Number(cur.PORT || DEFAULT_PORT) || DEFAULT_PORT;
  const updates: Record<string, string> = { PORT: String(port) };
  if (cur.CORS_ORIGINS) {
    updates.CORS_ORIGINS = cur.CORS_ORIGINS.replace(
      new RegExp(
        `(https?://(?:localhost|127\\.0\\.0\\.1)):${previous}\\b`,
        'g',
      ),
      `$1:${port}`,
    );
  } else {
    updates.CORS_ORIGINS = `http://localhost:${port},http://127.0.0.1:${port}`;
  }
  return upsertEnvFile(filePath, updates);
}

export function loadEnvIntoProcess(filePath: string): void {
  const vars = readEnvFile(filePath);
  for (const [k, v] of Object.entries(vars)) {
    if (process.env[k] === undefined) {
      process.env[k] = v;
    }
  }
}
