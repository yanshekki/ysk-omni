import { randomBytes } from 'node:crypto';
import path from 'node:path';

const workspace = path.resolve(__dirname, '..');

/** True if raw is valid 32-byte AES key (base64 or 64-hex). */
function isValidEncryptionKey(raw: string | undefined): boolean {
  if (!raw?.trim()) return false;
  const trimmed = raw.trim();
  try {
    if (Buffer.from(trimmed, 'base64').length === 32) return true;
  } catch {
    /* fall through */
  }
  return /^[0-9a-fA-F]{64}$/.test(trimmed);
}

process.env.NODE_ENV = 'test';
process.env.PORT = '3099';
process.env.HOST = '127.0.0.1';
// Absolute file URL so tests always hit project-root data/test.db
process.env.DATABASE_URL =
  process.env.DATABASE_URL || `file:${path.join(workspace, 'data', 'test.db')}`;
// Prefer env when valid; never keep a broken CI/placeholder key (e.g. wrong base64 length)
process.env.ENCRYPTION_KEY = isValidEncryptionKey(process.env.ENCRYPTION_KEY)
  ? process.env.ENCRYPTION_KEY!.trim()
  : randomBytes(32).toString('base64');
process.env.GROK_BIN = process.env.GROK_BIN || 'grok';
process.env.GROK_DEFAULT_MODEL = 'grok-4.5';
process.env.GROK_DEFAULT_CWD = workspace;
process.env.GROK_CWD_ALLOWLIST = workspace;
process.env.GROK_TIMEOUT_MS = '60000';
process.env.GROK_MAX_CONCURRENT = '2';
process.env.GROK_ALWAYS_APPROVE = 'true';
process.env.CORS_ORIGINS = 'http://localhost:3000';
process.env.RATE_LIMIT_WINDOW_MS = '60000';
process.env.RATE_LIMIT_MAX = '1000';
process.env.BODY_LIMIT = '1mb';
process.env.UPLOAD_MAX_BYTES = '1048576';
process.env.DOCUMENT_DB_MAX_BYTES = '1024';
process.env.STORAGE_DIR = path.join(workspace, 'storage');
process.env.LOG_LEVEL = 'error';
process.env.TRUST_PROXY = 'false';
