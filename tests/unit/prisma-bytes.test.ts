import { describe, expect, it } from 'vitest';
import { toBytes, toPrismaBytes } from '../../src/utils/prisma-bytes';

describe('prisma-bytes', () => {
  it('copies Buffer for Prisma Bytes fields', () => {
    const src = Buffer.from('abc');
    const out = toPrismaBytes(src);
    expect(Buffer.isBuffer(out)).toBe(true);
    expect(out.equals(src)).toBe(true);
    expect(toBytes).toBe(toPrismaBytes);
  });
});
