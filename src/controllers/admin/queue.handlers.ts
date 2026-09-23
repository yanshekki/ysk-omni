import type { Request, Response } from 'express';
import {
  queueJobListQuerySchema,
  queuePolicyUpdateSchema,
  queuePriorityBodySchema,
} from '../../dto/queue.dto';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { asyncHandler } from '../../utils/async-handler';
import { chatQueueService } from '../../services/queue/chat-queue.service';
import { queuePolicyService } from '../../services/queue/queue-policy.service';
import { chatWorkerService } from '../../services/queue/chat-worker.service';
import { AUDIT_ACTIONS } from '../../config/constants';
import { auditService } from '../../services/audit.service';
import { requestIp } from '../../utils/client-ip';

export const adminQueueHandlers = {
  stats: asyncHandler(async (_req: Request, res: Response) => {
    const data = await chatQueueService.stats();
    res.json({
      object: 'admin.queue.stats',
      data: {
        ...data,
        workerActive: chatWorkerService.getActiveCount(),
      },
    });
  }),

  listJobs: asyncHandler(async (req: Request, res: Response) => {
    const q = queueJobListQuerySchema.parse(req.query);
    const { rows, total } = await chatQueueService.listJobs(q);
    res.json({
      object: 'list',
      total,
      limit: q.limit,
      offset: q.offset,
      data: rows,
    });
  }),

  getJob: asyncHandler(async (req: Request, res: Response) => {
    const job = await chatQueueService.getJob(String(req.params.id));
    if (!job) throw ExceptionFactory.notFound('Job');
    // Never return encrypted payload ciphertext to UI — metadata only
    res.json({
      object: 'admin.queue.job',
      data: {
        id: job.id,
        requestId: job.requestId,
        apiKeyId: job.apiKeyId,
        source: job.source,
        status: job.status,
        priority: job.priority,
        attempt: job.attempt,
        maxAttempts: job.maxAttempts,
        model: job.model,
        stream: job.stream,
        queuedAt: job.queuedAt,
        startedAt: job.startedAt,
        finishedAt: job.finishedAt,
        cancelRequested: job.cancelRequested,
        errorCode: job.errorCode,
        errorMessage: job.errorMessage,
        leaseOwner: job.leaseOwner,
        leaseUntil: job.leaseUntil,
        resultChatRequestId: job.resultChatRequestId,
      },
    });
  }),

  cancelJob: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const id = String(req.params.id);
    const ok = await chatQueueService.requestCancel(id);
    if (!ok) throw ExceptionFactory.notFound('Job');
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.QUEUE_CANCEL,
      resource: 'chat_job',
      resourceId: id,
      ip: requestIp(req),
    });
    res.json({ object: 'admin.queue.job.cancelled', data: { id, ok: true } });
  }),

  requeueJob: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const id = String(req.params.id);
    const ok = await chatQueueService.requeue(id);
    if (!ok) throw ExceptionFactory.validation('Job cannot be requeued');
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.QUEUE_REQUEUE,
      resource: 'chat_job',
      resourceId: id,
      ip: requestIp(req),
    });
    res.json({ object: 'admin.queue.job.requeued', data: { id, ok: true } });
  }),

  setPriority: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const id = String(req.params.id);
    const body = queuePriorityBodySchema.parse(req.body);
    const ok = await chatQueueService.setPriority(id, body.priority);
    if (!ok) throw ExceptionFactory.validation('Only queued jobs can change priority');
    res.json({
      object: 'admin.queue.job.priority',
      data: { id, priority: body.priority },
    });
  }),

  getPolicy: asyncHandler(async (_req: Request, res: Response) => {
    const data = await queuePolicyService.get();
    res.json({ object: 'admin.queue.policy', data });
  }),

  putPolicy: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const partial = queuePolicyUpdateSchema.parse(req.body || {});
    const data = await queuePolicyService.update(partial);
    await auditService.log({
      apiKeyId: req.apiKey.id,
      action: AUDIT_ACTIONS.QUEUE_POLICY_UPDATE,
      resource: 'queue_policy',
      meta: { keys: Object.keys(partial) },
      ip: requestIp(req),
    });
    res.json({ object: 'admin.queue.policy', data });
  }),

  pause: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await queuePolicyService.update({ paused: true });
    res.json({ object: 'admin.queue.policy', data });
  }),

  resume: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await queuePolicyService.update({ paused: false });
    res.json({ object: 'admin.queue.policy', data });
  }),

  drain: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await queuePolicyService.update({ drainMode: true });
    res.json({ object: 'admin.queue.policy', data });
  }),

  undrain: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const data = await queuePolicyService.update({ drainMode: false });
    res.json({ object: 'admin.queue.policy', data });
  }),

  purgeDead: asyncHandler(async (req: Request, res: Response) => {
    if (!req.apiKey) throw ExceptionFactory.unauthorized();
    const count = await chatQueueService.purgeDead();
    res.json({ object: 'admin.queue.purge', data: { deleted: count } });
  }),
};
