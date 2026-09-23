import { z } from 'zod';

export const queuePolicySchema = z.object({
  enabled: z.boolean(),
  globalConcurrency: z.number().int().min(1).max(64),
  perKeyConcurrency: z.number().int().min(1).max(16),
  maxQueueDepth: z.number().int().min(1).max(10_000),
  maxQueueDepthPerKey: z.number().int().min(1).max(1000),
  defaultPriority: z.number().int().min(0).max(1000),
  playgroundPriority: z.number().int().min(0).max(1000),
  leaseMs: z.number().int().min(5_000).max(600_000),
  leaseHeartbeatMs: z.number().int().min(2_000).max(120_000),
  maxWaitMs: z.number().int().min(5_000).max(3_600_000),
  maxAttempts: z.number().int().min(1).max(5),
  fairness: z.enum(['fifo_global', 'weighted_round_robin']),
  paused: z.boolean(),
  drainMode: z.boolean(),
});

export type QueuePolicyDto = z.infer<typeof queuePolicySchema>;

export const queuePolicyUpdateSchema = queuePolicySchema.partial();
export type QueuePolicyUpdateDto = z.infer<typeof queuePolicyUpdateSchema>;

export const queueJobListQuerySchema = z.object({
  status: z.string().optional(),
  apiKeyId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  sortBy: z.string().max(64).optional(),
  sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type QueueJobListQueryDto = z.infer<typeof queueJobListQuerySchema>;

export const queuePriorityBodySchema = z.object({
  priority: z.number().int().min(0).max(1000),
});
