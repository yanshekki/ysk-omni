import { z } from 'zod';

export const listDocumentsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export type ListDocumentsDto = z.infer<typeof listDocumentsSchema>;

export const documentIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type DocumentIdParamDto = z.infer<typeof documentIdParamSchema>;
