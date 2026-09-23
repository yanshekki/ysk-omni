import {
  emitJson,
  initCliRuntime,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { printTable } from '../lib/print-table';
import { fail, info, ok } from '../lib/print';

export async function cmdAdminSessionsList(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const now = new Date();
  const rows = await withPrisma(rt.databaseUrl, (prisma) =>
    prisma.adminSession.findMany({
      where: { expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ip: true,
        userAgent: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
      },
    }),
  );
  if (rt.json) {
    emitJson({ total: rows.length, data: rows });
    return;
  }
  info(`Active OTP sessions: ${rows.length}`);
  printTable(
    ['id', 'ip', 'created', 'lastUsed', 'expires'],
    rows.map((s) => [
      s.id.slice(0, 8),
      s.ip || '—',
      s.createdAt.toISOString().slice(0, 19),
      s.lastUsedAt?.toISOString().slice(0, 19) || '—',
      s.expiresAt.toISOString().slice(0, 19),
    ]),
  );
}

export async function cmdAdminSessionsRevoke(
  opts: CliOpts & { id: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const target = String(opts.id || '').trim();
  if (target === 'all-expired' || target === 'expired') {
    const now = new Date();
    const r = await withPrisma(rt.databaseUrl, (prisma) =>
      prisma.adminSession.deleteMany({ where: { expiresAt: { lt: now } } }),
    );
    ok(`Purged ${r.count} expired session(s)`);
    return;
  }
  if (target === 'all') {
    const r = await withPrisma(rt.databaseUrl, (prisma) =>
      prisma.adminSession.deleteMany({}),
    );
    ok(`Revoked all sessions (${r.count})`);
    return;
  }
  const r = await withPrisma(rt.databaseUrl, (prisma) =>
    prisma.adminSession.deleteMany({
      where: {
        OR: [{ id: target }, { id: { startsWith: target } }],
      },
    }),
  );
  if (r.count === 0) {
    fail(`Session not found: ${target}`);
    process.exitCode = 1;
    return;
  }
  ok(`Revoked ${r.count} session(s) matching ${target}`);
}
