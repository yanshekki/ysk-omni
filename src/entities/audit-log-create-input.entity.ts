export interface AuditLogCreateInput {
  apiKeyId?: string | null;
  action: string;
  resource?: string | null;
  resourceId?: string | null;
  meta?: Record<string, unknown> | null;
  ip?: string | null;
}
