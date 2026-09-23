import { prisma } from '../../config/database';
import { SETTING_KEYS } from '../../config/constants';
import { env } from '../../config/env';
import {
  queuePolicySchema,
  type QueuePolicyDto,
  type QueuePolicyUpdateDto,
} from '../../dto/queue.dto';
import { logger } from '../../utils/logger';

export type QueuePolicy = QueuePolicyDto;

type RebuildHook = () => void;

export function defaultQueuePolicy(): QueuePolicy {
  return {
    enabled: true,
    globalConcurrency: Math.max(1, Math.min(env.GROK_MAX_CONCURRENT, 8)),
    perKeyConcurrency: 1,
    maxQueueDepth: 100,
    maxQueueDepthPerKey: 20,
    defaultPriority: 100,
    playgroundPriority: 50,
    leaseMs: 45_000,
    leaseHeartbeatMs: 15_000,
    maxWaitMs: Math.max(env.GROK_TIMEOUT_MS, 600_000),
    maxAttempts: 1,
    fairness: 'weighted_round_robin',
    paused: false,
    drainMode: false,
  };
}

/** CLI may write policy to DB; reload so live gateway picks it up without restart. */
const POLICY_TTL_MS = 2_000;

export class QueuePolicyService {
  private cache: QueuePolicy = defaultQueuePolicy();
  private loaded = false;
  private loadedAt = 0;
  private hooks: RebuildHook[] = [];

  onRebuild(hook: RebuildHook): void {
    this.hooks.push(hook);
  }

  getSync(): QueuePolicy {
    return this.cache;
  }

  async load(): Promise<QueuePolicy> {
    try {
      const row = await prisma.setting.findUnique({
        where: { key: SETTING_KEYS.QUEUE_POLICY },
      });
      if (row?.value) {
        const parsed = queuePolicySchema.safeParse(JSON.parse(row.value));
        if (parsed.success) {
          this.cache = parsed.data;
          this.loaded = true;
          this.loadedAt = Date.now();
          return this.cache;
        }
      }
    } catch (err) {
      logger.warn({ err }, 'Failed to load queue policy; using defaults');
    }
    this.cache = defaultQueuePolicy();
    this.loaded = true;
    this.loadedAt = Date.now();
    return this.cache;
  }

  async get(): Promise<QueuePolicy> {
    if (!this.loaded || Date.now() - this.loadedAt > POLICY_TTL_MS) {
      await this.load();
    }
    return this.cache;
  }

  async update(partial: QueuePolicyUpdateDto): Promise<QueuePolicy> {
    const next = queuePolicySchema.parse({
      ...(await this.get()),
      ...partial,
    });
    await prisma.setting.upsert({
      where: { key: SETTING_KEYS.QUEUE_POLICY },
      create: { key: SETTING_KEYS.QUEUE_POLICY, value: JSON.stringify(next) },
      update: { value: JSON.stringify(next) },
    });
    this.cache = next;
    this.loaded = true;
    this.loadedAt = Date.now();
    for (const h of this.hooks) {
      try {
        h();
      } catch {
        /* ignore */
      }
    }
    return next;
  }

  async reset(): Promise<QueuePolicy> {
    return this.update(defaultQueuePolicy());
  }
}

export const queuePolicyService = new QueuePolicyService();
