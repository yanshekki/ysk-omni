import { z } from 'zod';

export const createFileSchema = z.object({
  purpose: z
    .enum([
      'assistants',
      'vision',
      'fine-tune',
      'batch',
      'user_data',
      'assistants_output',
    ])
    .optional()
    .default('user_data'),
});

export type CreateFileDto = z.infer<typeof createFileSchema>;

export const fileIdParamSchema = z.object({
  id: z.string().uuid(),
});
