import { z } from 'zod';
import { KEY_MODES, ROLES, SAFE_TOOLS_MODES } from '../config/constants';

export const adminListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  status: z.string().optional(),
  apiKeyId: z.string().uuid().optional(),
  model: z.string().optional(),
  q: z.string().max(200).optional(),
  action: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  hasDocuments: z
    .union([z.boolean(), z.enum(['true', 'false', '1', '0', ''])])
    .optional(),
  policyMode: z.string().optional(),
  refresh: z
    .union([z.boolean(), z.enum(['true', 'false', '1', '0'])])
    .optional(),
  /** Whitelist field name (resource-specific); default = time column */
  sortBy: z.string().max(64).optional(),
  /** Default desc (newest first) */
  sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type AdminListQueryDto = z.infer<typeof adminListQuerySchema>;

export const adminIdParamSchema = z.object({
  id: z.string().uuid(),
});

const ipEntrySchema = z
  .string()
  .min(1)
  .max(64)
  .regex(
    /^(?:(?:\d{1,3}\.){3}\d{1,3}(?:\/(?:3[0-2]|[12]?\d))?|[0-9a-fA-F:.]+)$/,
    'Invalid IP or CIDR',
  );

export const adminCreateKeySchema = z.object({
  name: z.string().min(1).max(128),
  role: z.enum([ROLES.CLIENT, ROLES.ADMIN]).optional().default(ROLES.CLIENT),
  mode: z.enum([KEY_MODES.SAFE, KEY_MODES.AGENT]).optional().default(KEY_MODES.SAFE),
  rateLimit: z.number().int().min(1).max(10_000).optional().default(60),
  maxTurns: z.number().int().min(1).max(100).nullable().optional(),
  timeoutMs: z.number().int().min(1000).max(3_600_000).nullable().optional(),
  ipWhitelist: z.array(ipEntrySchema).max(100).optional().default([]),
});

export const adminUpdateKeySchema = z.object({
  name: z.string().min(1).max(128).optional(),
  role: z.enum([ROLES.CLIENT, ROLES.ADMIN]).optional(),
  mode: z.enum([KEY_MODES.SAFE, KEY_MODES.AGENT]).optional(),
  rateLimit: z.number().int().min(1).max(10_000).optional(),
  isActive: z.boolean().optional(),
  maxTurns: z.number().int().min(1).max(100).nullable().optional(),
  timeoutMs: z.number().int().min(1000).max(3_600_000).nullable().optional(),
  ipWhitelist: z.array(ipEntrySchema).max(100).nullable().optional(),
});

export const adminIpBanSchema = z.object({
  ip: z.string().min(1).max(64),
  reason: z.string().max(500).optional(),
  /** seconds from now; omit/null = permanent */
  ttlSeconds: z.number().int().min(0).max(365 * 24 * 3600).nullable().optional(),
});

export const adminUpdateSettingsSchema = z.object({
  globalSafeMode: z.boolean().optional(),
  safeMaxTurns: z.number().int().min(1).max(50).optional(),
  safeTimeoutMs: z.number().int().min(5000).max(3_600_000).optional(),
  safeToolsMode: z
    .enum([SAFE_TOOLS_MODES.NONE, SAFE_TOOLS_MODES.READONLY])
    .optional(),
  defaultModel: z.string().min(1).max(128).optional(),
  adminPanelEnabled: z.boolean().optional(),
});
