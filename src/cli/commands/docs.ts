import {
  emitJson,
  initCliRuntime,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { printTable } from '../lib/print-table';
import { fail, info, ok } from '../lib/print';

export async function cmdDocsList(
  opts: CliOpts & { limit?: number; offset?: number },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);
  const { rows, total } = await withPrisma(rt.databaseUrl, async (prisma) => {
    const where = { deletedAt: null };
    const [rows, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          originalName: true,
          mimeType: true,
          sizeBytes: true,
          storageType: true,
          apiKeyId: true,
          createdAt: true,
        },
      }),
      prisma.document.count({ where }),
    ]);
    return { rows, total };
  });
  if (rt.json) {
    emitJson({ total, limit, offset, data: rows });
    return;
  }
  info(`Documents: ${total}`);
  printTable(
    ['id', 'name', 'mime', 'size', 'storage', 'created'],
    rows.map((d) => [
      d.id.slice(0, 8),
      d.originalName.slice(0, 32),
      d.mimeType.slice(0, 20),
      d.sizeBytes,
      d.storageType,
      d.createdAt.toISOString().slice(0, 19),
    ]),
  );
}

export async function cmdDocsShow(
  opts: CliOpts & { id: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const doc = await withPrisma(rt.databaseUrl, (prisma) =>
    prisma.document.findFirst({
      where: { id: opts.id, deletedAt: null },
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        sizeBytes: true,
        storageType: true,
        checksumSha256: true,
        apiKeyId: true,
        createdAt: true,
      },
    }),
  );
  if (!doc) {
    fail(`Document not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  if (rt.json) emitJson(doc);
  else {
    info(`Document ${doc.id}`);
    for (const [k, v] of Object.entries(doc)) {
      info(`  ${k}: ${v instanceof Date ? v.toISOString() : v}`);
    }
  }
}

export async function cmdDocsDelete(
  opts: CliOpts & { id: string; yes?: boolean },
): Promise<void> {
  const rt = initCliRuntime(opts);
  if (!opts.yes) {
    fail('Refusing to delete without --yes');
    process.exitCode = 1;
    return;
  }
  const n = await withPrisma(rt.databaseUrl, async (prisma) => {
    const doc = await prisma.document.findFirst({
      where: { id: opts.id, deletedAt: null },
    });
    if (!doc) return 0;
    await prisma.document.update({
      where: { id: opts.id },
      data: { deletedAt: new Date() },
    });
    return 1;
  });
  if (!n) {
    fail(`Document not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  ok(`Soft-deleted document ${opts.id}`);
}
