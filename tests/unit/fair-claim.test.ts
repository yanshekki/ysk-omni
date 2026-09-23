import { describe, expect, it } from 'vitest';
import {
  decideIdempotency,
  pickNextClaimCandidate,
  type ClaimCandidate,
} from '../../src/services/queue/fair-claim';

const t0 = new Date('2026-01-01T00:00:00Z');
const t1 = new Date('2026-01-01T00:00:01Z');
const t2 = new Date('2026-01-01T00:00:02Z');

function job(
  id: string,
  apiKeyId: string,
  priority: number,
  queuedAt: Date,
): ClaimCandidate {
  return { id, apiKeyId, priority, queuedAt };
}

describe('pickNextClaimCandidate', () => {
  it('returns null for empty list', () => {
    expect(pickNextClaimCandidate([], 'fifo_global', 0)).toBeNull();
  });

  it('fifo_global picks head of pre-sorted list', () => {
    const eligible = [
      job('a', 'k1', 10, t0),
      job('b', 'k2', 20, t1),
    ];
    const r = pickNextClaimCandidate(eligible, 'fifo_global', 5);
    expect(r?.pick.id).toBe('a');
    expect(r?.nextCursor).toBe(5);
  });

  it('weighted_round_robin rotates across keys alphabetically', () => {
    const eligible = [
      job('a1', 'kA', 100, t0),
      job('a2', 'kA', 100, t1),
      job('b1', 'kB', 100, t0),
      job('c1', 'kC', 50, t0),
    ];
    const r0 = pickNextClaimCandidate(eligible, 'weighted_round_robin', 0);
    expect(r0?.pick.id).toBe('a1'); // kA first (sorted keys)
    expect(r0?.nextCursor).toBe(1);

    const r1 = pickNextClaimCandidate(eligible, 'weighted_round_robin', 1);
    expect(r1?.pick.id).toBe('b1');
    expect(r1?.nextCursor).toBe(2);

    const r2 = pickNextClaimCandidate(eligible, 'weighted_round_robin', 2);
    expect(r2?.pick.id).toBe('c1'); // priority 50 within kC
    expect(r2?.nextCursor).toBe(0);
  });

  it('within key picks lower priority then earlier time', () => {
    const eligible = [
      job('late', 'k1', 50, t2),
      job('early-high', 'k1', 10, t1),
      job('early-low', 'k1', 10, t0),
    ];
    const r = pickNextClaimCandidate(eligible, 'weighted_round_robin', 0);
    expect(r?.pick.id).toBe('early-low');
  });
});

describe('decideIdempotency', () => {
  const active = ['queued', 'leased', 'running'] as const;

  it('null when no existing row', () => {
    expect(decideIdempotency(null, active, 'succeeded')).toBeNull();
  });

  it('reuses active jobs', () => {
    expect(
      decideIdempotency(
        { id: 'j1', status: 'queued' },
        active,
        'succeeded',
      ),
    ).toEqual({ action: 'reuse', jobId: 'j1' });
  });

  it('marks succeeded as already_done', () => {
    expect(
      decideIdempotency(
        { id: 'j2', status: 'succeeded', resultChatRequestId: 'cr1' },
        active,
        'succeeded',
      ),
    ).toEqual({
      action: 'already_done',
      jobId: 'j2',
      resultChatRequestId: 'cr1',
    });
  });

  it('retires key for failed/dead/cancelled', () => {
    for (const status of ['failed', 'dead', 'cancelled']) {
      expect(
        decideIdempotency({ id: 'j3', status }, active, 'succeeded'),
      ).toEqual({ action: 'retire_key_and_create' });
    }
  });
});
