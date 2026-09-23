import { describe, expect, it } from 'vitest';
import {
  defaultQueuePolicy,
  queuePolicyService,
} from '../../src/services/queue/queue-policy.service';
import { queuePolicySchema } from '../../src/dto/queue.dto';

describe('queue policy', () => {
  it('default policy is valid', () => {
    const d = defaultQueuePolicy();
    expect(queuePolicySchema.parse(d).enabled).toBe(true);
    expect(d.perKeyConcurrency).toBe(1);
    expect(d.globalConcurrency).toBeGreaterThanOrEqual(1);
  });

  it('getSync returns object after construct', () => {
    const p = queuePolicyService.getSync();
    expect(p).toHaveProperty('maxQueueDepth');
  });
});
