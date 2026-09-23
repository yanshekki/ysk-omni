/**
 * Pure fair-claim selection for the durable chat queue.
 * Kept free of Prisma so fairness / RR can be unit-tested without a DB.
 */

export type ClaimCandidate = {
  id: string;
  apiKeyId: string;
  priority: number;
  queuedAt: Date;
};

export type FairnessMode = 'fifo_global' | 'weighted_round_robin';

/**
 * Pick the next job id from eligible candidates.
 * - fifo_global: first in already-sorted list (priority ASC, queuedAt ASC)
 * - weighted_round_robin: rotate across apiKeyId partitions; within key, priority+FIFO
 *
 * @returns selected candidate and next RR cursor (mod key count)
 */
export function pickNextClaimCandidate(
  eligible: ClaimCandidate[],
  fairness: FairnessMode,
  rrCursor: number,
): { pick: ClaimCandidate; nextCursor: number } | null {
  if (!eligible.length) return null;

  if (fairness !== 'weighted_round_robin') {
    return { pick: eligible[0]!, nextCursor: rrCursor };
  }

  const byKey = new Map<string, ClaimCandidate[]>();
  for (const j of eligible) {
    const list = byKey.get(j.apiKeyId) || [];
    list.push(j);
    byKey.set(j.apiKeyId, list);
  }
  const keys = [...byKey.keys()].sort();
  if (!keys.length) return null;

  const cursor = ((rrCursor % keys.length) + keys.length) % keys.length;
  const key = keys[cursor]!;
  const nextCursor = (cursor + 1) % keys.length;
  const list = byKey.get(key)!;
  list.sort(
    (a, b) =>
      a.priority - b.priority || a.queuedAt.getTime() - b.queuedAt.getTime(),
  );
  return { pick: list[0]!, nextCursor };
}

/**
 * Decide how to treat an existing job when the same idempotency key is reused.
 */
export type IdempotencyDecision =
  | { action: 'reuse'; jobId: string }
  | { action: 'already_done'; jobId: string; resultChatRequestId: string | null }
  | { action: 'retire_key_and_create' };

export function decideIdempotency(
  existing: {
    id: string;
    status: string;
    resultChatRequestId?: string | null;
  } | null,
  activeStatuses: readonly string[],
  succeededStatus: string,
): IdempotencyDecision | null {
  if (!existing) return null;
  if (activeStatuses.includes(existing.status)) {
    return { action: 'reuse', jobId: existing.id };
  }
  if (existing.status === succeededStatus) {
    return {
      action: 'already_done',
      jobId: existing.id,
      resultChatRequestId: existing.resultChatRequestId ?? null,
    };
  }
  // failed / cancelled / dead → free the unique key for a new attempt
  return { action: 'retire_key_and_create' };
}
