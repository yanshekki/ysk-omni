import type { z } from 'zod';
import type {
  adminCreateKeySchema,
  adminUpdateKeySchema,
  adminUpdateSettingsSchema,
  adminIpBanSchema,
} from '../../dto/admin.dto';

export type CreateKeyBody = z.infer<typeof adminCreateKeySchema>;
export type UpdateKeyBody = z.infer<typeof adminUpdateKeySchema>;
export type UpdateSettingsBody = z.infer<typeof adminUpdateSettingsSchema>;
export type IpBanBody = z.infer<typeof adminIpBanSchema>;
