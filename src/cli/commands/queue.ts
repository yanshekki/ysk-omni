import { CHAT_JOB_STATUS, SETTING_KEYS } from '../../config/constants';
import {
  queuePolicySchema,
  type QueuePolicyDto,
} from '../../dto/queue.dto';
import {
  emitJson,
  initCliRuntime,
  parseOnOff,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { printTable } from '../lib/print-table';
import { fail, info, ok } from '../lib/print';

type QueuePolicy = QueuePolicyDto;

/** Local defaults (avoid importing server env at module load). */
function defaultQueuePolicy(): QueuePolicy {
  return {
    enabled: true,
    globalConcurrency: 4,
    perKeyConcurrency: 1,
    maxQueueDepth: 100,
    maxQueueDepthPerKey: 20,
    defaultPriority: 100,
    playgroundPriority: 50,
    leaseMs: 45_000,
    leaseHeartbeatMs: 15_000,
    maxWaitMs: 600_000,
    maxAttempts: 1,
    fairness: 'weighted_round_robin',
    paused: false,
    drainMode: false,
  };
}

const QUEUE_PRESETS: Record<string, Partial<QueuePolicy>> = {
  relaxed: {
    enabled: true,
    globalConcurrency: 6,
    perKeyConcurrency: 2,
    maxQueueDepth: 200,
    maxQueueDepthPerKey: 40,
    fairness: 'weighted_round_robin',
    defaultPriority: 100,
    playgroundPriority: 40,
    leaseMs: 60_000,
    maxWaitMs: 900_000,
  },
  balanced: {
    enabled: true,
    globalConcurrency: 4,
    perKeyConcurrency: 1,
    maxQueueDepth: 100,
    maxQueueDepthPerKey: 20,
    fairness: 'weighted_round_robin',
    defaultPriority: 100,
    playgroundPriority: 50,
    leaseMs: 45_000,
    maxWaitMs: 600_000,
  },
  strict: {
    enabled: true,
    globalConcurrency: 2,
    perKeyConcurrency: 1,
    maxQueueDepth: 40,
    maxQueueDepthPerKey: 8,
    fairness: 'fifo_global',
    defaultPriority: 100,
    playgroundPriority: 80,
    leaseMs: 30_000,
    maxWaitMs: 300_000,
  },
};

async function loadPolicy(databaseUrl: string): Promise<QueuePolicy> {
  return withPrisma(databaseUrl, async (prisma) => {
    const row = await prisma.setting.findUnique({
      where: { key: SETTING_KEYS.QUEUE_POLICY },
    });
    if (row?.value) {
      try {
        const parsed = queuePolicySchema.safeParse(JSON.parse(row.value));
        if (parsed.success) return parsed.data;
      } catch {
        /* fall through */
      }
    }
    return defaultQueuePolicy();
  });
}

async function savePolicy(
  databaseUrl: string,
  policy: QueuePolicy,
): Promise<QueuePolicy> {
  const next = queuePolicySchema.parse(policy);
  await withPrisma(databaseUrl, async (prisma) => {
    await prisma.setting.upsert({
      where: { key: SETTING_KEYS.QUEUE_POLICY },
      create: { key: SETTING_KEYS.QUEUE_POLICY, value: JSON.stringify(next) },
      update: { value: JSON.stringify(next) },
    });
  });
  return next;
}

function printPolicy(p: QueuePolicy): void {
  info('Chat queue policy');
  info(`  enabled:             ${p.enabled}`);
  info(`  paused:              ${p.paused}`);
  info(`  drainMode:           ${p.drainMode}`);
  info(`  globalConcurrency:   ${p.globalConcurrency}`);
  info(`  perKeyConcurrency:   ${p.perKeyConcurrency}`);
  info(`  maxQueueDepth:       ${p.maxQueueDepth}`);
  info(`  maxQueueDepthPerKey: ${p.maxQueueDepthPerKey}`);
  info(`  fairness:            ${p.fairness}`);
  info(`  defaultPriority:     ${p.defaultPriority}`);
  info(`  playgroundPriority:  ${p.playgroundPriority}`);
  info(`  leaseMs:             ${p.leaseMs}`);
  info(`  maxWaitMs:           ${p.maxWaitMs}`);
  info(`  maxAttempts:         ${p.maxAttempts}`);
}

export async function cmdQueueStats(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const policy = await loadPolicy(rt.databaseUrl);
  const data = await withPrisma(rt.databaseUrl, async (prisma) => {
    const groups = await prisma.chatJob.groupBy({
      by: ['status'],
      _count: true,
    });
    const byStatus: Record<string, number> = {};
    for (const g of groups) byStatus[g.status] = g._count;
    const depth =
      (byStatus[CHAT_JOB_STATUS.QUEUED] || 0) +
      (byStatus[CHAT_JOB_STATUS.LEASED] || 0) +
      (byStatus[CHAT_JOB_STATUS.RUNNING] || 0);
    return { byStatus, depth };
  });
  const out = {
    policy: {
      enabled: policy.enabled,
      paused: policy.paused,
      drainMode: policy.drainMode,
      globalConcurrency: policy.globalConcurrency,
    },
    depth: data.depth,
    byStatus: data.byStatus,
  };
  if (rt.json) {
    emitJson(out);
    return;
  }
  info('Chat queue stats');
  info(
    `  state:   ${!policy.enabled ? 'DISABLED' : policy.paused ? 'PAUSED' : policy.drainMode ? 'DRAIN' : 'LIVE'}`,
  );
  info(`  depth:   ${data.depth} (active backlog)`);
  info(`  slots:   globalConcurrency=${policy.globalConcurrency}`);
  for (const [st, n] of Object.entries(data.byStatus).sort()) {
    info(`  ${st.padEnd(12)} ${n}`);
  }
}

export async function cmdQueuePolicyGet(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const p = await loadPolicy(rt.databaseUrl);
  if (rt.json) emitJson(p);
  else printPolicy(p);
}

export async function cmdQueuePolicySet(
  opts: CliOpts & Record<string, unknown>,
): Promise<void> {
  const rt = initCliRuntime(opts);
  const cur = await loadPolicy(rt.databaseUrl);
  const partial: Partial<QueuePolicy> = {};
  try {
    if (opts.enabled !== undefined) partial.enabled = parseOnOff(String(opts.enabled));
    if (opts.paused !== undefined) partial.paused = parseOnOff(String(opts.paused));
    if (opts.drainMode !== undefined) {
      partial.drainMode = parseOnOff(String(opts.drainMode));
    }
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
    return;
  }
  const numKeys = [
    'globalConcurrency',
    'perKeyConcurrency',
    'maxQueueDepth',
    'maxQueueDepthPerKey',
    'defaultPriority',
    'playgroundPriority',
    'leaseMs',
    'maxWaitMs',
    'maxAttempts',
  ] as const;
  for (const k of numKeys) {
    const v = opts[k];
    if (v !== undefined && v !== null && v !== '') {
      (partial as Record<string, number>)[k] = Number(v);
    }
  }
  if (opts.fairness !== undefined) {
    const f = String(opts.fairness);
    if (f !== 'fifo_global' && f !== 'weighted_round_robin') {
      fail('fairness must be fifo_global | weighted_round_robin');
      process.exitCode = 1;
      return;
    }
    partial.fairness = f;
  }
  if (!Object.keys(partial).length) {
    fail('No fields to update');
    process.exitCode = 1;
    return;
  }
  const next = await savePolicy(rt.databaseUrl, { ...cur, ...partial });
  ok('Queue policy updated (live within ~2s)');
  if (rt.json) emitJson(next);
  else printPolicy(next);
}

export async function cmdQueuePolicyPreset(
  opts: CliOpts & { name: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const name = String(opts.name || '').toLowerCase();
  const preset = QUEUE_PRESETS[name];
  if (!preset) {
    fail(`Unknown preset: ${opts.name}`);
    info('Available: relaxed, balanced, strict');
    process.exitCode = 1;
    return;
  }
  const cur = await loadPolicy(rt.databaseUrl);
  const next = await savePolicy(rt.databaseUrl, {
    ...cur,
    ...preset,
    paused: false,
    drainMode: false,
  });
  ok(`Applied queue preset: ${name}`);
  if (rt.json) emitJson(next);
  else printPolicy(next);
}

async function patchFlags(
  opts: CliOpts,
  patch: Partial<Pick<QueuePolicy, 'paused' | 'drainMode' | 'enabled'>>,
  label: string,
): Promise<void> {
  const rt = initCliRuntime(opts);
  const cur = await loadPolicy(rt.databaseUrl);
  const next = await savePolicy(rt.databaseUrl, { ...cur, ...patch });
  ok(label);
  if (rt.json) emitJson(next);
  else printPolicy(next);
}

export async function cmdQueuePause(opts: CliOpts): Promise<void> {
  await patchFlags(opts, { paused: true }, 'Queue paused');
}
export async function cmdQueueResume(opts: CliOpts): Promise<void> {
  await patchFlags(opts, { paused: false }, 'Queue resumed');
}
export async function cmdQueueDrain(opts: CliOpts): Promise<void> {
  await patchFlags(opts, { drainMode: true }, 'Queue drain mode ON (no new jobs)');
}
export async function cmdQueueUndrain(opts: CliOpts): Promise<void> {
  await patchFlags(opts, { drainMode: false }, 'Queue drain mode OFF');
}

export async function cmdQueueJobs(
  opts: CliOpts & { status?: string; limit?: number; offset?: number },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);
  const where = opts.status ? { status: opts.status } : {};
  const { rows, total } = await withPrisma(rt.databaseUrl, async (prisma) => {
    const [rows, total] = await Promise.all([
      prisma.chatJob.findMany({
        where,
        orderBy: { queuedAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          status: true,
          source: true,
          model: true,
          priority: true,
          apiKeyId: true,
          attempt: true,
          queuedAt: true,
          errorMessage: true,
          cancelRequested: true,
        },
      }),
      prisma.chatJob.count({ where }),
    ]);
    return { rows, total };
  });
  if (rt.json) {
    emitJson({ total, limit, offset, data: rows });
    return;
  }
  info(`Jobs: ${total} total (showing ${rows.length})`);
  printTable(
    ['id', 'status', 'src', 'model', 'pri', 'apiKey', 'queued'],
    rows.map((j) => [
      j.id.slice(0, 8),
      j.cancelRequested ? `${j.status}*` : j.status,
      j.source,
      j.model || '—',
      j.priority,
      (j.apiKeyId || '').slice(0, 8),
      j.queuedAt.toISOString().slice(0, 19),
    ]),
  );
}

export async function cmdQueueJob(
  opts: CliOpts & { id: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const job = await withPrisma(rt.databaseUrl, (prisma) =>
    prisma.chatJob.findUnique({
      where: { id: opts.id },
      select: {
        id: true,
        requestId: true,
        status: true,
        source: true,
        model: true,
        stream: true,
        priority: true,
        apiKeyId: true,
        attempt: true,
        maxAttempts: true,
        queuedAt: true,
        startedAt: true,
        finishedAt: true,
        cancelRequested: true,
        errorCode: true,
        errorMessage: true,
        leaseOwner: true,
        leaseUntil: true,
      },
    }),
  );
  if (!job) {
    fail(`Job not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  if (rt.json) emitJson(job);
  else {
    info(`Job ${job.id}`);
    for (const [k, v] of Object.entries(job)) {
      info(`  ${k}: ${v instanceof Date ? v.toISOString() : v ?? '—'}`);
    }
  }
}

export async function cmdQueueCancel(
  opts: CliOpts & { id: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const okCancel = await withPrisma(rt.databaseUrl, async (prisma) => {
    const job = await prisma.chatJob.findUnique({ where: { id: opts.id } });
    if (!job) return false;
    const terminal = [
      CHAT_JOB_STATUS.SUCCEEDED,
      CHAT_JOB_STATUS.FAILED,
      CHAT_JOB_STATUS.CANCELLED,
      CHAT_JOB_STATUS.DEAD,
    ];
    if (terminal.includes(job.status as never)) return false;
    if (job.status === CHAT_JOB_STATUS.QUEUED) {
      await prisma.chatJob.update({
        where: { id: opts.id },
        data: {
          status: CHAT_JOB_STATUS.CANCELLED,
          finishedAt: new Date(),
          cancelRequested: true,
          errorMessage: 'Cancelled via CLI',
          leaseOwner: null,
          leaseUntil: null,
        },
      });
    } else {
      await prisma.chatJob.update({
        where: { id: opts.id },
        data: { cancelRequested: true },
      });
    }
    return true;
  });
  if (!okCancel) {
    fail(`Cannot cancel job: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  ok(`Cancel requested: ${opts.id}`);
}

export async function cmdQueueRequeue(
  opts: CliOpts & { id: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const okRq = await withPrisma(rt.databaseUrl, async (prisma) => {
    const job = await prisma.chatJob.findUnique({ where: { id: opts.id } });
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
      where: { id: opts.id },
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
  });
  if (!okRq) {
    fail(`Cannot requeue job: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  ok(`Requeued: ${opts.id}`);
}

export async function cmdQueuePriority(
  opts: CliOpts & { id: string; priority: number },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const pri = Math.max(0, Math.min(1000, Math.floor(opts.priority)));
  const n = await withPrisma(rt.databaseUrl, (prisma) =>
    prisma.chatJob.updateMany({
      where: { id: opts.id, status: CHAT_JOB_STATUS.QUEUED },
      data: { priority: pri },
    }),
  );
  if (n.count !== 1) {
    fail(`Job not found or not queued: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  ok(`Priority set to ${pri} for ${opts.id}`);
}

export async function cmdQueuePurgeDead(
  opts: CliOpts & { yes?: boolean },
): Promise<void> {
  const rt = initCliRuntime(opts);
  if (!opts.yes) {
    fail('Refusing to purge without --yes');
    process.exitCode = 1;
    return;
  }
  const r = await withPrisma(rt.databaseUrl, (prisma) =>
    prisma.chatJob.deleteMany({
      where: {
        status: {
          in: [
            CHAT_JOB_STATUS.DEAD,
            CHAT_JOB_STATUS.FAILED,
            CHAT_JOB_STATUS.CANCELLED,
          ],
        },
      },
    }),
  );
  ok(`Purged ${r.count} terminal job(s) (dead/failed/cancelled)`);
}
