import {
  emitJson,
  initCliRuntime,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { printTable } from '../lib/print-table';
import { info } from '../lib/print';

export async function cmdAuditList(
  opts: CliOpts & {
    action?: string;
    limit?: number;
    offset?: number;
  },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);
  const where: Record<string, unknown> = {};
  if (opts.action) where.action = opts.action;

  const { rows, total } = await withPrisma(rt.databaseUrl, async (prisma) => {
    const [rows, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          action: true,
          resource: true,
          resourceId: true,
          ip: true,
          createdAt: true,
          apiKeyId: true,
        },
      }),
      prisma.auditLog.count({ where }),
    ]);
    return { rows, total };
  });

  if (rt.json) {
    emitJson({ total, limit, offset, data: rows });
    return;
  }
  info(`Audit logs: ${total}`);
  printTable(
    ['time', 'action', 'resource', 'resourceId', 'ip'],
    rows.map((a) => [
      a.createdAt.toISOString().slice(0, 19),
      a.action.slice(0, 28),
      a.resource || '—',
      (a.resourceId || '—').slice(0, 12),
      a.ip || '—',
    ]),
  );
}
