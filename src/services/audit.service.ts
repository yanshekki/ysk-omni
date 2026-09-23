import { prisma } from '../config/database';
import type { AuditLogCreateInput } from '../entities';
import { toAuditApiKeyId } from '../utils/api-key-id';
import { logger } from '../utils/logger';

export class AuditService {
  /**
   * Best-effort audit write. Never throw — audit must not turn business
   * operations into HTTP 500 (e.g. OTP session / FK edge cases).
   */
  async log(input: AuditLogCreateInput): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          // OTP session ids are not real api_keys rows — store null instead of FK fail
          apiKeyId: toAuditApiKeyId(input.apiKeyId),
          action: input.action,
          resource: input.resource ?? null,
          resourceId: input.resourceId ?? null,
          metaJson: input.meta ? JSON.stringify(input.meta) : null,
          ip: input.ip ?? null,
        },
      });
    } catch (err) {
      logger.warn(
        {
          err,
          action: input.action,
          resource: input.resource,
          apiKeyId: toAuditApiKeyId(input.apiKeyId),
        },
        'Audit log write failed (ignored)',
      );
    }
  }
}

export const auditService = new AuditService();
