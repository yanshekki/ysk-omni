import { prisma } from '../config/database';
import { ROLES } from '../config/constants';
import { logger } from '../utils/logger';

/** Pure normalize lives in utils/role-normalize — re-export for service callers. */
export { normalizeApiKeyRole } from '../utils/role-normalize';

/** One-shot DB fix: role=user → client */
export async function backfillApiKeyRoles(): Promise<number> {
  const result = await prisma.apiKey.updateMany({
    where: { role: 'user' },
    data: { role: ROLES.CLIENT },
  });
  if (result.count > 0) {
    logger.info(
      { count: result.count },
      'Backfilled api_keys.role user → client',
    );
  }
  return result.count;
}
