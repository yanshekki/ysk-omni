import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ensureRelativeStoragePath,
  resolveSafeCwd,
  sanitizeFilename,
} from '../../src/utils/path-safe';
import { HttpException } from '../../src/exceptions/http.exception';

describe('path-safe', () => {
  const workspace = path.resolve(__dirname, '../..');

  it('allows default workspace cwd', () => {
    expect(resolveSafeCwd(undefined)).toBe(workspace);
    expect(resolveSafeCwd(workspace)).toBe(workspace);
  });

  it('allows nested path under allowlist', () => {
    const nested = path.join(workspace, 'src');
    expect(resolveSafeCwd(nested)).toBe(nested);
  });

  it('rejects path outside allowlist', () => {
    expect(() => resolveSafeCwd('/tmp')).toThrow(HttpException);
  });

  it('sanitizes dangerous filenames', () => {
    expect(sanitizeFilename('../../etc/passwd')).toBe('passwd');
    // path.basename strips directory segments
    expect(sanitizeFilename('a/b/c.txt')).toBe('c.txt');
    expect(sanitizeFilename('ok-file_1.md')).toBe('ok-file_1.md');
    // disallowed characters become underscores
    expect(sanitizeFilename('weird name!.txt')).toBe('weird name_.txt');
  });

  it('ensures relative storage path', () => {
    expect(ensureRelativeStoragePath('abc-123')).toBe('abc-123');
    expect(() => ensureRelativeStoragePath('../x')).toThrow(HttpException);
    expect(() => ensureRelativeStoragePath('a/b')).toThrow(HttpException);
    expect(() => ensureRelativeStoragePath('')).toThrow(HttpException);
  });
});
