import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';
import path from 'node:path';

loadDotenv();

const envSchema = z.object({
  // Default production for installable gateway; set development only for local coding
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.coerce.number().int().positive().default(3847),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().min(1),
  ENCRYPTION_KEY: z.string().min(1),
  ADMIN_BOOTSTRAP_KEY: z.string().optional(),
  GCTOAC_HOME: z.string().optional(),

  GROK_BIN: z.string().default('grok'),
  GROK_DEFAULT_MODEL: z.string().default('grok-4.6'),
  GROK_DEFAULT_CWD: z.string().default(''),
  GROK_CWD_ALLOWLIST: z.string().default(''),
  GROK_TIMEOUT_MS: z.coerce.number().int().positive().default(600_000),
  GROK_MAX_CONCURRENT: z.coerce.number().int().positive().default(4),
  GROK_ALWAYS_APPROVE: z
    .string()
    .default('true')
    .transform((v) => v === 'true' || v === '1'),
  /** Force all keys into safe mode when true (overrides per-key agent). */
  GROK_SAFE_MODE: z
    .string()
    .default('false')
    .transform((v) => v === 'true' || v === '1'),
  GROK_SAFE_MAX_TURNS: z.coerce.number().int().positive().default(4),
  GROK_SAFE_TIMEOUT_MS: z.coerce.number().int().positive().default(120_000),
  ADMIN_PANEL_ENABLED: z
    .string()
    .default('true')
    .transform((v) => v === 'true' || v === '1'),
  PM2_ADMIN_ENABLED: z
    .string()
    .default('true')
    .transform((v) => v === 'true' || v === '1'),

  CORS_ORIGINS: z.string().default('http://localhost:3847,http://127.0.0.1:3847'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  /** Stricter cap for unauthenticated / IP-only traffic */
  RATE_LIMIT_IP_MAX: z.coerce.number().int().positive().default(60),
  /** Short-window burst cap per chat API key (10s window) */
  CHAT_BURST_MAX: z.coerce.number().int().positive().default(20),
  /** Failed auth attempts before temporary IP block */
  BLOCK_FAILED_AUTH_THRESHOLD: z.coerce.number().int().positive().default(20),
  BLOCK_FAILED_AUTH_WINDOW_MS: z.coerce.number().int().positive().default(300_000),
  BLOCK_DURATION_MS: z.coerce.number().int().positive().default(600_000),
  BODY_LIMIT: z.string().default('1mb'),
  UPLOAD_MAX_BYTES: z.coerce.number().int().positive().default(10 * 1024 * 1024),
  DOCUMENT_DB_MAX_BYTES: z.coerce.number().int().positive().default(1024 * 1024),
  STORAGE_DIR: z.string().default('./storage'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  /**
   * Trust reverse proxy hops for client IP (nginx / Cloudflare / LB).
   * - false / 0: use socket only (ignore X-Forwarded-For)
   * - true / 1: trust 1 hop (typical nginx or CF → app)
   * - 2+: e.g. Cloudflare → nginx → app
   */
  TRUST_PROXY: z
    .string()
    .default('1')
    .transform((v) => {
      const s = String(v).trim().toLowerCase();
      if (s === 'false' || s === '0' || s === 'no' || s === 'off') return 0;
      if (s === 'true' || s === 'yes' || s === 'on') return 1;
      const n = Number(s);
      if (Number.isFinite(n) && n >= 0) return Math.min(10, Math.floor(n));
      return 1;
    }),
  /**
   * Client IP source when proxies are trusted:
   * auto | cloudflare | nginx | x-forwarded-for | socket
   */
  PROXY_IP_SOURCE: z
    .enum(['auto', 'cloudflare', 'nginx', 'x-forwarded-for', 'socket'])
    .default('auto'),
  /**
   * Durable chat work-queue backend.
   * sqlite = ChatJob table + in-process worker (default, production-ready).
   * redis / kafka = reserved multi-node backends (not implemented yet).
   */
  QUEUE_BACKEND: z.enum(['sqlite', 'redis', 'kafka']).default('sqlite'),
});

function parseEncryptionKey(raw: string): Buffer {
  const trimmed = raw.trim();
  // base64
  try {
    const buf = Buffer.from(trimmed, 'base64');
    if (buf.length === 32) return buf;
  } catch {
    /* fall through */
  }
  // hex
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, 'hex');
  }
  throw new Error(
    'ENCRYPTION_KEY must be a 32-byte key encoded as base64 or 64-char hex (openssl rand -base64 32)',
  );
}

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((i) => `${i.path.join('.')}: ${i.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

const data = parsed.data;
const encryptionKey = parseEncryptionKey(data.ENCRYPTION_KEY);

const storageDir = path.resolve(data.STORAGE_DIR);
const defaultCwd = data.GROK_DEFAULT_CWD.trim()
  ? path.resolve(data.GROK_DEFAULT_CWD)
  : path.join(storageDir, 'workspaces', 'default');

const cwdAllowlist = data.GROK_CWD_ALLOWLIST
  ? data.GROK_CWD_ALLOWLIST.split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((p) => path.resolve(p))
  : [defaultCwd];

export const env = {
  ...data,
  encryptionKey,
  corsOrigins: data.CORS_ORIGINS.split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  cwdAllowlist,
  storageDir,
  defaultCwd,
  isProd: data.NODE_ENV === 'production',
  isDev: data.NODE_ENV === 'development',
  /** Number of trusted reverse-proxy hops (0 = off). */
  trustProxyHops: data.TRUST_PROXY,
  /** @deprecated use trustProxyHops; kept as boolean for older call sites */
  TRUST_PROXY: data.TRUST_PROXY > 0,
};

export type Env = typeof env;
