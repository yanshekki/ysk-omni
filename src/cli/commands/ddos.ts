import { randomUUID } from 'node:crypto';
import { SETTING_KEYS } from '../../config/constants';
import {
  ddosPolicySchema,
  type DdosPolicyDto,
} from '../../dto/ddos.dto';
import {
  emitJson,
  initCliRuntime,
  parseOnOff,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { printTable } from '../lib/print-table';
import { fail, info, ok } from '../lib/print';

type DdosPolicy = DdosPolicyDto;

/** Lazy: needs process.env from initCliRuntime first. */
async function loadDdosHelpers() {
  const mod = await import('../../services/ddos-policy.service');
  return mod;
}

async function loadPolicy(databaseUrl: string): Promise<DdosPolicy> {
  const { defaultDdosPolicyFromEnv } = await loadDdosHelpers();
  return withPrisma(databaseUrl, async (prisma) => {
    const fallback = defaultDdosPolicyFromEnv();
    const row = await prisma.setting.findUnique({
      where: { key: SETTING_KEYS.DDOS_POLICY },
    });
    if (!row?.value) return fallback;
    try {
      const parsed = ddosPolicySchema.safeParse({
        ...fallback,
        ...JSON.parse(row.value),
      });
      return parsed.success ? parsed.data : fallback;
    } catch {
      return fallback;
    }
  });
}

async function savePolicy(
  databaseUrl: string,
  policy: DdosPolicy,
): Promise<DdosPolicy> {
  const next = ddosPolicySchema.parse(policy);
  await withPrisma(databaseUrl, async (prisma) => {
    await prisma.setting.upsert({
      where: { key: SETTING_KEYS.DDOS_POLICY },
      create: { key: SETTING_KEYS.DDOS_POLICY, value: JSON.stringify(next) },
      update: { value: JSON.stringify(next) },
    });
  });
  return next;
}

function printPolicy(p: DdosPolicy): void {
  info('DDoS / abuse policy');
  info(`  autoBanEnabled:     ${p.autoBanEnabled}`);
  info(`  rateLimitMax:       ${p.rateLimitMax} / window ${p.rateLimitWindowMs}ms`);
  info(`  rateLimitIpMax:     ${p.rateLimitIpMax}`);
  info(`  chatBurstMax:       ${p.chatBurstMax}`);
  info(`  autoAuth:           ${p.autoAuthEnabled} (thr ${p.failedAuthThreshold})`);
  info(`  autoRate:           ${p.autoRateEnabled} (thr ${p.rateHitThreshold})`);
  info(`  autoConn:           ${p.autoConnEnabled} (max ${p.maxConcurrentPerIp})`);
  info(`  autoVelocity:       ${p.autoVelocityEnabled} (max ${p.velocityMaxRequests})`);
  info(`  escalate:           ${p.escalateEnabled} after ${p.escalateAfterBans}`);
  info(`  whitelist:          ${(p.whitelist || []).join(', ') || '—'}`);
  info(`  proxyIpSource:      ${p.proxyIpSource} hops=${p.proxyTrustHops}`);
}

export async function cmdDdosSummary(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const policy = await loadPolicy(rt.databaseUrl);
  const bans = await withPrisma(rt.databaseUrl, async (prisma) => {
    const now = new Date();
    return prisma.ipBlacklist.findMany({
      where: {
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  });
  if (rt.json) {
    emitJson({ policy, blacklistCount: bans.length, blacklistSample: bans });
    return;
  }
  printPolicy(policy);
  info('');
  info(`Active blacklist entries: ${bans.length}`);
  if (bans.length) {
    printTable(
      ['ip', 'source', 'reason', 'expires'],
      bans.slice(0, 10).map((b) => [
        b.ip,
        b.source || '—',
        (b.reason || '—').slice(0, 24),
        b.expiresAt ? b.expiresAt.toISOString() : 'permanent',
      ]),
    );
  }
}

export async function cmdDdosPolicyGet(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const p = await loadPolicy(rt.databaseUrl);
  if (rt.json) emitJson(p);
  else printPolicy(p);
}

export async function cmdDdosPolicySet(
  opts: CliOpts & Record<string, unknown>,
): Promise<void> {
  const rt = initCliRuntime(opts);
  const cur = await loadPolicy(rt.databaseUrl);
  const partial: Record<string, unknown> = {};
  try {
    for (const key of [
      'autoBanEnabled',
      'autoAuthEnabled',
      'autoRateEnabled',
      'autoConnEnabled',
      'autoVelocityEnabled',
      'escalateEnabled',
    ] as const) {
      const flag = opts[key] ?? opts[key.replace('Enabled', '')];
      // map CLI kebab flags passed as camel after commander
      void flag;
    }
    if (opts.autoBan !== undefined) {
      partial.autoBanEnabled = parseOnOff(String(opts.autoBan));
    }
    if (opts.autoBanEnabled !== undefined) {
      partial.autoBanEnabled = parseOnOff(String(opts.autoBanEnabled));
    }
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
    return;
  }

  const numMap: Record<string, string> = {
    rateLimitMax: 'rateLimitMax',
    rateLimitIpMax: 'rateLimitIpMax',
    chatBurstMax: 'chatBurstMax',
    failedAuthThreshold: 'failedAuthThreshold',
    rateHitThreshold: 'rateHitThreshold',
    maxConcurrentPerIp: 'maxConcurrentPerIp',
    velocityMaxRequests: 'velocityMaxRequests',
    proxyTrustHops: 'proxyTrustHops',
  };
  for (const [cliKey, polKey] of Object.entries(numMap)) {
    const v = opts[cliKey];
    if (v !== undefined && v !== null && v !== '') {
      partial[polKey] = Number(v);
    }
  }
  if (opts.proxyIpSource !== undefined) {
    partial.proxyIpSource = String(opts.proxyIpSource);
  }
  if (!Object.keys(partial).length) {
    fail(
      'No fields. Example: gctoac ddos policy set --auto-ban on --rate-limit-max 120',
    );
    process.exitCode = 1;
    return;
  }
  try {
    const next = await savePolicy(rt.databaseUrl, {
      ...cur,
      ...partial,
    } as DdosPolicy);
    ok('DDoS policy updated (live within ~2s)');
    if (rt.json) emitJson(next);
    else printPolicy(next);
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
  }
}

export async function cmdDdosPolicyPreset(
  opts: CliOpts & { name: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const name = String(opts.name || '').toLowerCase();
  if (name !== 'relaxed' && name !== 'balanced' && name !== 'strict') {
    fail('Preset must be relaxed | balanced | strict');
    process.exitCode = 1;
    return;
  }
  const { ddosPreset } = await loadDdosHelpers();
  const next = await savePolicy(rt.databaseUrl, ddosPreset(name));
  ok(`Applied DDoS preset: ${name}`);
  if (rt.json) emitJson(next);
  else printPolicy(next);
}

export async function cmdDdosPolicyReset(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const { defaultDdosPolicyFromEnv } = await loadDdosHelpers();
  const next = await savePolicy(rt.databaseUrl, defaultDdosPolicyFromEnv());
  ok('DDoS policy reset to env defaults');
  if (rt.json) emitJson(next);
  else printPolicy(next);
}

export async function cmdDdosBan(
  opts: CliOpts & { ip: string; ttl?: number; reason?: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const ip = String(opts.ip || '').trim();
  if (!ip) {
    fail('IP required');
    process.exitCode = 1;
    return;
  }
  const expiresAt =
    opts.ttl != null && opts.ttl > 0
      ? new Date(Date.now() + opts.ttl * 1000)
      : null;
  await withPrisma(rt.databaseUrl, async (prisma) => {
    await prisma.ipBlacklist.upsert({
      where: { ip },
      create: {
        id: randomUUID(),
        ip,
        reason: opts.reason ?? 'manual CLI ban',
        source: 'manual',
        expiresAt,
        createdBy: 'cli',
      },
      update: {
        reason: opts.reason ?? 'manual CLI ban',
        source: 'manual',
        expiresAt,
        createdBy: 'cli',
      },
    });
  });
  ok(
    `Banned ${ip}${expiresAt ? ` until ${expiresAt.toISOString()}` : ' (permanent)'} — live within ~5s`,
  );
}

export async function cmdDdosUnban(
  opts: CliOpts & { ip: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const ip = String(opts.ip || '').trim();
  const r = await withPrisma(rt.databaseUrl, (prisma) =>
    prisma.ipBlacklist.deleteMany({ where: { ip } }),
  );
  if (r.count === 0) {
    fail(`No blacklist entry for ${ip}`);
    process.exitCode = 1;
    return;
  }
  ok(`Unbanned ${ip} — live within ~5s`);
}

export async function cmdDdosBlacklist(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const now = new Date();
  const rows = await withPrisma(rt.databaseUrl, (prisma) =>
    prisma.ipBlacklist.findMany({
      where: {
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { createdAt: 'desc' },
    }),
  );
  if (rt.json) {
    emitJson({ total: rows.length, data: rows });
    return;
  }
  info(`Blacklist: ${rows.length}`);
  printTable(
    ['ip', 'source', 'reason', 'expires', 'created'],
    rows.map((b) => [
      b.ip,
      b.source || '—',
      (b.reason || '—').slice(0, 28),
      b.expiresAt ? b.expiresAt.toISOString().slice(0, 19) : 'permanent',
      b.createdAt.toISOString().slice(0, 19),
    ]),
  );
}
