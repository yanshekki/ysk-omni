import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';
import { ExceptionFactory } from '../exceptions/exception.factory';

function resolveMaybeReal(p: string): string {
  const abs = path.resolve(p);
  try {
    if (fs.existsSync(abs)) return fs.realpathSync(abs);
  } catch {
    /* ignore */
  }
  return abs;
}

export function resolveSafeCwd(input?: string | null): string {
  const candidate = resolveMaybeReal(input?.trim() || env.defaultCwd);

  const allowed = env.cwdAllowlist.some((root) => {
    const resolvedRoot = resolveMaybeReal(root);
    return candidate === resolvedRoot || candidate.startsWith(resolvedRoot + path.sep);
  });

  if (!allowed) {
    throw ExceptionFactory.invalidCwd(
      `cwd "${candidate}" is outside the allowlist: ${env.cwdAllowlist.join(', ')}`,
    );
  }

  return candidate;
}

export function sanitizeFilename(name: string): string {
  const base = path.basename(name).replace(/[^\w.\-()+ ]+/g, '_').slice(0, 200);
  return base.length > 0 ? base : 'upload.bin';
}

export function ensureRelativeStoragePath(fileId: string): string {
  if (!fileId || fileId.includes('..') || fileId.includes('/') || fileId.includes('\\')) {
    throw ExceptionFactory.validation('Invalid storage path');
  }
  const safe = fileId.replace(/[^a-zA-Z0-9\-_]/g, '');
  if (!safe || safe !== fileId) {
    throw ExceptionFactory.validation('Invalid storage path');
  }
  return safe;
}
