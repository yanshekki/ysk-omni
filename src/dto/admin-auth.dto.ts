import { z } from 'zod';

export const adminOtpLoginSchema = z.object({
  code: z
    .string()
    .min(6)
    .max(32)
    .transform((s) => s.trim()),
});

export type AdminOtpLoginDto = z.infer<typeof adminOtpLoginSchema>;
