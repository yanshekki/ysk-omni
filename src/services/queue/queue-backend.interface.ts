/**
 * Pluggable durable chat-queue backend.
 *
 * Production default: SQLite (`ChatJob` table) — single-process, crash-safe
 * leases, no external broker. Redis / Kafka stubs are reserved for multi-node
 * deployments; selecting them without an implementation throws at boot.
 */

import type { CreateChatCompletionDto } from '../../dto/chat.dto';
import type { ChatContext } from '../../interfaces/chat-context.interface';
import type { QueuePolicy } from './queue-policy.service';

export type QueueBackendKind = 'sqlite' | 'redis' | 'kafka';

export type EnqueueResult = {
  jobId: string;
  position: number;
  policy: QueuePolicy;
  /** Same Idempotency-Key already finished successfully */
  alreadyDone?: boolean;
  resultChatRequestId?: string | null;
};

export type QueueStats = {
  policy: QueuePolicy;
  byStatus: Record<string, number>;
  depth: number;
  running: number;
  leased: number;
  queued: number;
  dead: number;
  oldestQueuedAt: Date | null;
  oldestQueuedAgeMs: number;
  workerId: string;
};

export interface ChatQueueBackend {
  readonly kind: QueueBackendKind;
  readonly workerId: string;

  enqueue(input: {
    dto: CreateChatCompletionDto;
    ctx: ChatContext;
    source: 'v1' | 'playground';
    idempotencyKey?: string;
  }): Promise<EnqueueResult>;

  estimatePosition(jobId: string): Promise<number>;
  reclaimExpiredLeases(): Promise<number>;
  reclaimAllInFlightOnBoot(): Promise<number>;
  claimNext(policy: QueuePolicy): Promise<string | null>;
  heartbeat(jobId: string, policy: QueuePolicy): Promise<void>;
  markRunning(jobId: string): Promise<void>;
  markSucceeded(jobId: string, chatRequestId?: string): Promise<void>;
  markFailed(jobId: string, err: Error, dead?: boolean): Promise<void>;
  markCancelled(jobId: string, message?: string): Promise<void>;
  requestCancel(jobId: string): Promise<boolean>;
  requeue(jobId: string): Promise<boolean>;
  setPriority(jobId: string, priority: number): Promise<boolean>;
  getJob(id: string): Promise<unknown>;
  listJobs(query: {
    status?: string;
    apiKeyId?: string;
    limit: number;
    offset: number;
  }): Promise<{ rows: unknown[]; total: number }>;
  stats(): Promise<QueueStats>;
  purgeDead(): Promise<number>;
}

export function parseQueueBackendKind(
  raw: string | undefined | null,
): QueueBackendKind {
  const v = String(raw || 'sqlite')
    .trim()
    .toLowerCase();
  if (v === 'redis' || v === 'kafka' || v === 'sqlite') return v;
  return 'sqlite';
}
