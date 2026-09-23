export type { AuditLogCreateInput } from './audit-log-create-input.entity';

export interface AuditLogEntity {
  id: string;
  apiKeyId: string | null;
  action: string;
  resource: string | null;
  resourceId: string | null;
  metaJson: string | null;
  ip: string | null;
  createdAt: Date;
}
