import { randomBytes } from 'node:crypto';
import { prisma } from '../../config/database';
import {
  CHAT_JOB_SOURCE,
  CHAT_JOB_STATUS,
} from '../../config/constants';
import type { CreateChatCompletionDto } from '../../dto/chat.dto';
import type { ChatContext } from '../../interfaces/chat-context.interface';
import type { ChatJobPayload } from '../../interfaces/chat-job-payload.interface';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { createId } from '../../utils/id';
import { toBytes } from '../../utils/prisma-bytes';
import { logger } from '../../utils/logger';
import { resolveScalarOrderBy } from '../../utils/list-sort';
import { encryptionService } from '../encryption.service';
import { decideIdempotency, pickNextClaimCandidate } from './fair-claim';
import type {
  ChatQueueBackend,
  EnqueueResult,
  QueueStats,
} from './queue-backend.interface';
import { queuePolicyService, type QueuePolicy } from './queue-policy.service';
import { jobWaiterRegistry } from './job-waiter';

const WORKER_ID = `w_${randomBytes(6).toString('hex')}`;

const QUEUE_JOB_SORT_FIELDS = [
  'queuedAt',
  'priority',
  'status',
  'model',
  'attempt',
  'startedAt',
  'finishedAt',
] as const;

const ACTIVE_STATUSES = [
  CHAT_JOB_STATUS.QUEUED,
  CHAT_JOB_STATUS.LEASED,
  CHAT_JOB_STATUS.RUNNING,
] as const;

export class ChatQueueService implements ChatQueueBackend {
  readonly kind = 'sqlite' as const;
  private rrCursor = 0;

  get workerId(): string {
    return WORKER_ID;
  }

  async enqueue(input: {
    dto: CreateChatCompletionDto;
    ctx: ChatContext;
    source: 'v1' | 'playground';
    idempotencyKey?: string;
    wireFormat?: import('../../interfaces/chat-job-payload.interface').StreamWireFormat;
  }): Promise<EnqueueResult> {
    const policy = await queuePolicyService.get();
    if (!policy.enabled) {
      throw ExceptionFactory.internal('Queue disabled');
    }
    if (policy.drainMode) {
      throw ExceptionFactory.queueUnavailable(
        'Queue is in drain mode; new jobs are not accepted',
      );
    }

    if (input.idempotencyKey) {
      const existing = await prisma.chatJob.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      const decision = decideIdempotency(
        existing,
        ACTIVE_STATUSES,
        CHAT_JOB_STATUS.SUCCEEDED,
      );
      if (decision?.action === 'reuse') {
        const position = await this.estimatePosition(decision.jobId);
        return { jobId: decision.jobId, position, policy };
      }
      if (decision?.action === 'already_done') {
        return {
          jobId: decision.jobId,
          position: 0,
          policy,
          alreadyDone: true,
          resultChatRequestId: decision.resultChatRequestId,
        };
      }
      if (decision?.action === 'retire_key_and_create' && existing) {
        // failed/cancelled/dead: free unique key for a new attempt
        await prisma.chatJob.update({
          where: { id: existing.id },
          data: {
            idempotencyKey: `${existing.idempotencyKey}:old:${existing.id}`,
          },
        });
      }
    }

    const depth = await prisma.chatJob.count({
      where: {
        status: {
          in: [
            CHAT_JOB_STATUS.QUEUED,
            CHAT_JOB_STATUS.LEASED,
            CHAT_JOB_STATUS.RUNNING,
          ],
        },
      },
    });
    if (depth >= policy.maxQueueDepth) {
      throw ExceptionFactory.queueFull(
        `Chat queue full (${depth}/${policy.maxQueueDepth})`,
      );
    }

    // OTP sessions use synthetic ids — index / fair-share on a real key row
    const { toPersistentApiKeyId } = await import('../../utils/api-key-id');
    const ownerApiKeyId = await toPersistentApiKeyId(input.ctx.apiKey.id);

    const perKey = await prisma.chatJob.count({
      where: {
        apiKeyId: ownerApiKeyId,
        status: {
          in: [
            CHAT_JOB_STATUS.QUEUED,
            CHAT_JOB_STATUS.LEASED,
            CHAT_JOB_STATUS.RUNNING,
          ],
        },
      },
    });
    if (perKey >= policy.maxQueueDepthPerKey) {
      throw ExceptionFactory.queueFull(
        `Per-key queue full (${perKey}/${policy.maxQueueDepthPerKey})`,
      );
    }

    const priority =
      input.source === CHAT_JOB_SOURCE.PLAYGROUND
        ? policy.playgroundPriority
        : policy.defaultPriority;

    const payload: ChatJobPayload = {
      dto: input.dto,
      requestId: input.ctx.requestId,
      apiKeyId: ownerApiKeyId,
      apiKeySnapshot: {
        // Keep live actor identity (incl. OTP session) for policy/mode;
        // column apiKeyId is the persistent owner for fair-share & filters.
        id: input.ctx.apiKey.id,
        name: input.ctx.apiKey.name,
        keyPrefix: input.ctx.apiKey.keyPrefix,
        role: input.ctx.apiKey.role,
        mode: input.ctx.apiKey.mode,
        rateLimit: input.ctx.apiKey.rateLimit,
        isActive: input.ctx.apiKey.isActive,
        maxTurns: input.ctx.apiKey.maxTurns,
        timeoutMs: input.ctx.apiKey.timeoutMs,
        ipWhitelist: input.ctx.apiKey.ipWhitelist,
      },
      ip: input.ctx.ip,
      userAgent: input.ctx.userAgent,
      source: input.source,
      wireFormat: input.wireFormat || 'openai',
    };

    const enc = encryptionService.encrypt(JSON.stringify(payload));
    const id = createId();

    await prisma.chatJob.create({
      data: {
        id,
        requestId: input.ctx.requestId,
        apiKeyId: ownerApiKeyId,
        source: input.source,
        status: CHAT_JOB_STATUS.QUEUED,
        priority,
        maxAttempts: policy.maxAttempts,
        model: input.dto.model ?? null,
        stream: Boolean(input.dto.stream),
        payloadCiphertext: toBytes(enc.ciphertext),
        payloadIv: toBytes(enc.iv),
        payloadTag: toBytes(enc.tag),
        idempotencyKey: input.idempotencyKey ?? null,
      },
    });

    const position = await this.estimatePosition(id);
    logger.info(
      {
        jobId: id,
        apiKeyId: ownerApiKeyId,
        actorApiKeyId: input.ctx.apiKey.id,
        source: input.source,
        position,
        priority,
      },
      'Chat job enqueued',
    );
    return { jobId: id, position, policy };
  }

  async estimatePosition(jobId: string): Promise<number> {
    const job = await prisma.chatJob.findUnique({ where: { id: jobId } });
    if (!job || job.status !== CHAT_JOB_STATUS.QUEUED) return 0;
    const ahead = await prisma.chatJob.count({
      where: {
        status: CHAT_JOB_STATUS.QUEUED,
        OR: [
          { priority: { lt: job.priority } },
          {
            priority: job.priority,
            queuedAt: { lt: job.queuedAt },
          },
        ],
      },
    });
    return ahead + 1;
  }

  async reclaimExpiredLeases(): Promise<number> {
    const now = new Date();
    const result = await prisma.chatJob.updateMany({
      where: {
        status: { in: [CHAT_JOB_STATUS.LEASED, CHAT_JOB_STATUS.RUNNING] },
        leaseUntil: { lt: now },
        cancelRequested: false,
      },
      data: {
        status: CHAT_JOB_STATUS.QUEUED,
        leaseOwner: null,
        leaseUntil: null,
      },
    });
    if (result.count > 0) {
      logger.warn({ count: result.count }, 'Reclaimed expired chat job leases');
    }
    return result.count;
  }

  /**
   * Crash recovery: any leased/running job cannot have a live worker after process restart.
   * Re-queue all of them so at-least-once delivery resumes.
   */
  async reclaimAllInFlightOnBoot(): Promise<number> {
    const result = await prisma.chatJob.updateMany({
      where: {
        status: { in: [CHAT_JOB_STATUS.LEASED, CHAT_JOB_STATUS.RUNNING] },
        cancelRequested: false,
      },
      data: {
        status: CHAT_JOB_STATUS.QUEUED,
        leaseOwner: null,
        leaseUntil: null,
      },
    });
    if (result.count > 0) {
      logger.warn(
        { count: result.count },
        'Boot reclaim: re-queued in-flight chat jobs',
      );
    }
    // Cancelled mid-flight → terminal cancelled
    await prisma.chatJob.updateMany({
      where: {
        status: { in: [CHAT_JOB_STATUS.LEASED, CHAT_JOB_STATUS.RUNNING] },
        cancelRequested: true,
      },
      data: {
        status: CHAT_JOB_STATUS.CANCELLED,
        finishedAt: new Date(),
        leaseOwner: null,
        leaseUntil: null,
        errorMessage: 'Cancelled (process restart)',
      },
    });
    return result.count;
  }

  /**
   * Fair claim: weighted round-robin across apiKeyId (partition key),
   * then priority + FIFO within key. fifo_global = pure priority+time.
   */
  async claimNext(policy: QueuePolicy): Promise<string | null> {
    await this.reclaimExpiredLeases();

    const running = await prisma.chatJob.count({
      where: {
        status: { in: [CHAT_JOB_STATUS.LEASED, CHAT_JOB_STATUS.RUNNING] },
      },
    });
    if (running >= policy.globalConcurrency) return null;

    const queued = await prisma.chatJob.findMany({
      where: {
        status: CHAT_JOB_STATUS.QUEUED,
        cancelRequested: false,
        OR: [{ notBefore: null }, { notBefore: { lte: new Date() } }],
      },
      orderBy: [{ priority: 'asc' }, { queuedAt: 'asc' }],
      take: 200,
      select: { id: true, apiKeyId: true, priority: true, queuedAt: true },
    });
    if (!queued.length) return null;

    // Filter by per-key concurrency
    const runningByKey = await prisma.chatJob.groupBy({
      by: ['apiKeyId'],
      where: {
        status: { in: [CHAT_JOB_STATUS.LEASED, CHAT_JOB_STATUS.RUNNING] },
      },
      _count: true,
    });
    const runMap = new Map(
      runningByKey.map((r) => [r.apiKeyId, r._count]),
    );

    const eligible = queued.filter(
      (j) => (runMap.get(j.apiKeyId) || 0) < policy.perKeyConcurrency,
    );
    if (!eligible.length) return null;

    const selected = pickNextClaimCandidate(
      eligible,
      policy.fairness,
      this.rrCursor,
    );
    if (!selected) return null;
    this.rrCursor = selected.nextCursor;
    const pick = selected.pick;

    const leaseUntil = new Date(Date.now() + policy.leaseMs);
    const updated = await prisma.chatJob.updateMany({
      where: { id: pick.id, status: CHAT_JOB_STATUS.QUEUED },
      data: {
        status: CHAT_JOB_STATUS.LEASED,
        leaseOwner: WORKER_ID,
        leaseUntil,
        attempt: { increment: 1 },
      },
    });
    if (updated.count !== 1) return null;
    return pick.id;
  }

  async heartbeat(jobId: string, policy: QueuePolicy): Promise<void> {
    await prisma.chatJob.updateMany({
      where: {
        id: jobId,
        leaseOwner: WORKER_ID,
        status: { in: [CHAT_JOB_STATUS.LEASED, CHAT_JOB_STATUS.RUNNING] },
      },
      data: { leaseUntil: new Date(Date.now() + policy.leaseMs) },
    });
  }

  async markRunning(jobId: string): Promise<void> {
    await prisma.chatJob.updateMany({
      where: { id: jobId, leaseOwner: WORKER_ID },
      data: {
        status: CHAT_JOB_STATUS.RUNNING,
        startedAt: new Date(),
      },
    });
  }

  async markSucceeded(jobId: string, chatRequestId?: string): Promise<void> {
    await prisma.chatJob.update({
      where: { id: jobId },
      data: {
        status: CHAT_JOB_STATUS.SUCCEEDED,
        finishedAt: new Date(),
        leaseOwner: null,
        leaseUntil: null,
        resultChatRequestId: chatRequestId ?? null,
      },
    });
  }

  async markFailed(
    jobId: string,
    err: Error,
    dead = false,
  ): Promise<void> {
    await prisma.chatJob.update({
      where: { id: jobId },
      data: {
        status: dead ? CHAT_JOB_STATUS.DEAD : CHAT_JOB_STATUS.FAILED,
        finishedAt: new Date(),
        leaseOwner: null,
        leaseUntil: null,
        errorCode: (err as { code?: string }).code || 'error',
        errorMessage: err.message.slice(0, 2000),
      },
    });
  }

  async markCancelled(jobId: string, message?: string): Promise<void> {
    await prisma.chatJob.update({
      where: { id: jobId },
      data: {
        status: CHAT_JOB_STATUS.CANCELLED,
        finishedAt: new Date(),
        leaseOwner: null,
        leaseUntil: null,
        cancelRequested: true,
        errorMessage: (message || 'Cancelled').slice(0, 2000),
      },
    });
    jobWaiterRegistry.emitError(
      jobId,
      ExceptionFactory.queueCancelled(message),
    );
  }

  async requestCancel(jobId: string): Promise<boolean> {
    const job = await prisma.chatJob.findUnique({ where: { id: jobId } });
    if (!job) return false;
    if (
      [
        CHAT_JOB_STATUS.SUCCEEDED,
        CHAT_JOB_STATUS.FAILED,
        CHAT_JOB_STATUS.CANCELLED,
        CHAT_JOB_STATUS.DEAD,
      ].includes(job.status as never)
    ) {
      return false;
    }
    if (job.status === CHAT_JOB_STATUS.QUEUED) {
      await this.markCancelled(jobId, 'Cancelled while queued');
      return true;
    }
    await prisma.chatJob.update({
      where: { id: jobId },
      data: { cancelRequested: true },
    });
    return true;
  }

  async requeue(jobId: string): Promise<boolean> {
    const job = await prisma.chatJob.findUnique({ where: { id: jobId } });
    if (!job) return false;
    if (
      ![
        CHAT_JOB_STATUS.FAILED,
        CHAT_JOB_STATUS.DEAD,
        CHAT_JOB_STATUS.CANCELLED,
      ].includes(job.status as never)
    ) {
      return false;
    }
    await prisma.chatJob.update({
      where: { id: jobId },
      data: {
        status: CHAT_JOB_STATUS.QUEUED,
        cancelRequested: false,
        leaseOwner: null,
        leaseUntil: null,
        finishedAt: null,
        startedAt: null,
        errorCode: null,
        errorMessage: null,
        attempt: 0,
        queuedAt: new Date(),
      },
    });
    return true;
  }

  async setPriority(jobId: string, priority: number): Promise<boolean> {
    const r = await prisma.chatJob.updateMany({
      where: {
        id: jobId,
        status: CHAT_JOB_STATUS.QUEUED,
      },
      data: { priority },
    });
    return r.count === 1;
  }

  decryptPayload(job: {
    payloadCiphertext: Buffer | Uint8Array;
    payloadIv: Buffer | Uint8Array;
    payloadTag: Buffer | Uint8Array;
  }): ChatJobPayload {
    const raw = encryptionService.decryptToString({
      ciphertext: Buffer.from(job.payloadCiphertext),
      iv: Buffer.from(job.payloadIv),
      tag: Buffer.from(job.payloadTag),
    });
    return JSON.parse(raw) as ChatJobPayload;
  }

  async getJob(id: string) {
    return prisma.chatJob.findUnique({ where: { id } });
  }

  async listJobs(query: {
    status?: string;
    apiKeyId?: string;
    limit: number;
    offset: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }) {
    const where: Record<string, unknown> = {};
    if (query.status === 'active' || query.status === 'in_flight') {
      where.status = {
        in: [CHAT_JOB_STATUS.LEASED, CHAT_JOB_STATUS.RUNNING],
      };
    } else if (query.status) {
      where.status = query.status;
    }
    if (query.apiKeyId) where.apiKeyId = query.apiKeyId;

    const orderBy = resolveScalarOrderBy(
      query.sortBy,
      query.sortDir,
      QUEUE_JOB_SORT_FIELDS,
      'queuedAt',
    );

    const [rows, total] = await Promise.all([
      prisma.chatJob.findMany({
        where,
        orderBy,
        take: query.limit,
        skip: query.offset,
        select: {
          id: true,
          requestId: true,
          apiKeyId: true,
          source: true,
          status: true,
          priority: true,
          attempt: true,
          maxAttempts: true,
          model: true,
          stream: true,
          queuedAt: true,
          startedAt: true,
          finishedAt: true,
          cancelRequested: true,
          errorCode: true,
          errorMessage: true,
          leaseUntil: true,
          leaseOwner: true,
        },
      }),
      prisma.chatJob.count({ where }),
    ]);
    return { rows, total };
  }

  async stats(): Promise<QueueStats> {
    const policy = await queuePolicyService.get();
    const groups = await prisma.chatJob.groupBy({
      by: ['status'],
      _count: true,
    });
    const byStatus: Record<string, number> = {};
    for (const g of groups) byStatus[g.status] = g._count;

    const oldestQueued = await prisma.chatJob.findFirst({
      where: { status: CHAT_JOB_STATUS.QUEUED },
      orderBy: { queuedAt: 'asc' },
      select: { queuedAt: true },
    });

    const depth =
      (byStatus[CHAT_JOB_STATUS.QUEUED] || 0) +
      (byStatus[CHAT_JOB_STATUS.LEASED] || 0) +
      (byStatus[CHAT_JOB_STATUS.RUNNING] || 0);

    return {
      policy,
      byStatus,
      depth,
      running: byStatus[CHAT_JOB_STATUS.RUNNING] || 0,
      leased: byStatus[CHAT_JOB_STATUS.LEASED] || 0,
      queued: byStatus[CHAT_JOB_STATUS.QUEUED] || 0,
      dead: byStatus[CHAT_JOB_STATUS.DEAD] || 0,
      oldestQueuedAt: oldestQueued?.queuedAt ?? null,
      oldestQueuedAgeMs: oldestQueued
        ? Date.now() - oldestQueued.queuedAt.getTime()
        : 0,
      workerId: WORKER_ID,
    };
  }

  /**
   * Purge terminal jobs:
   * - DEAD (DLQ): always deletable (any age) — user expects banner purge to clear them
   * - succeeded / failed / cancelled: only if finishedAt older than 24h
   */
  async purgeDead(): Promise<number> {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [dead, aged] = await Promise.all([
      prisma.chatJob.deleteMany({
        where: { status: CHAT_JOB_STATUS.DEAD },
      }),
      prisma.chatJob.deleteMany({
        where: {
          status: {
            in: [
              CHAT_JOB_STATUS.FAILED,
              CHAT_JOB_STATUS.CANCELLED,
              CHAT_JOB_STATUS.SUCCEEDED,
            ],
          },
          finishedAt: { lt: cutoff },
        },
      }),
    ]);
    return dead.count + aged.count;
  }
}

export const chatQueueService = new ChatQueueService();
