import { z } from 'zod';
import { KEY_MODES, ROLES } from '../config/constants';

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(128),
  role: z.enum([ROLES.CLIENT, ROLES.ADMIN]).optional().default(ROLES.CLIENT),
  mode: z.enum([KEY_MODES.SAFE, KEY_MODES.AGENT]).optional().default(KEY_MODES.SAFE),
  rateLimit: z.number().int().min(1).max(10_000).optional().default(60),
});

export type CreateApiKeyDto = z.infer<typeof createApiKeySchema>;

export const apiKeyIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type ApiKeyIdParamDto = z.infer<typeof apiKeyIdParamSchema>;
