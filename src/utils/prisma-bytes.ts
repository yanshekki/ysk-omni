/**
 * Prisma Bytes fields accept Buffer; TS 5.x ArrayBufferLike mismatches
 * require a fresh Buffer copy in some call sites.
 */
 
export function toPrismaBytes(buf: Buffer): any {
  return Buffer.from(buf);
}

/** Alias used by chat/conversation services. */
export const toBytes = toPrismaBytes;
