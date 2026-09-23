import { prisma } from '../config/database';
import { ROLES } from '../config/constants';
import { ExceptionFactory } from '../exceptions/exception.factory';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * OTP Admin sessions use synthetic ids (`admin-session:…`) that are not rows
 * in `api_keys`. Using them as FK → Prisma P2003 / HTTP 500.
 */
export function isSyntheticApiKeyId(id: string | null | undefined): boolean {
  if (!id) return true;
  if (id.startsWith('admin-session:')) return true;
  if (id.startsWith('otp_sess')) return true;
  if (!UUID_RE.test(id)) return true;
  return false;
}

/** For AuditLog.apiKeyId (nullable FK). */
export function toAuditApiKeyId(id: string | null | undefined): string | null {
  return isSyntheticApiKeyId(id) ? null : (id as string);
}

/**
 * For Document / ChatRequest ownership (required FK).
 * Prefer a real key id; otherwise fall back to the oldest active admin key.
 */
export async function toPersistentApiKeyId(
  preferredId: string | null | undefined,
): Promise<string> {
  if (preferredId && !isSyntheticApiKeyId(preferredId)) {
    const exists = await prisma.apiKey.findUnique({
      where: { id: preferredId },
      select: { id: true },
    });
    if (exists) return exists.id;
  }

  const admin = await prisma.apiKey.findFirst({
    where: { isActive: true, role: ROLES.ADMIN },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });
  if (admin) return admin.id;

  throw ExceptionFactory.internal(
    'No admin API key available for resource ownership — create an admin API key (gctoac key create)',
  );
}
