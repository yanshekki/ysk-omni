import {
  emitJson,
  initCliRuntime,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { printTable } from '../lib/print-table';
import { fail, info, ok } from '../lib/print';

export async function cmdConversationsList(
  opts: CliOpts & { limit?: number; offset?: number },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 100);
  const offset = Math.max(opts.offset ?? 0, 0);
  const { rows, total } = await withPrisma(rt.databaseUrl, async (prisma) => {
    const [rows, total] = await Promise.all([
      prisma.chatConversation.findMany({
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          model: true,
          messageCount: true,
          preview: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
      prisma.chatConversation.count(),
    ]);
    return { rows, total };
  });
  if (rt.json) {
    emitJson({ total, limit, offset, data: rows });
    return;
  }
  info(`Playground conversations: ${total}`);
  printTable(
    ['id', 'title/preview', 'msgs', 'model', 'updated'],
    rows.map((c) => [
      c.id.slice(0, 8),
      (c.title || c.preview || '—').slice(0, 36),
      c.messageCount,
      (c.model || '—').slice(0, 12),
      c.updatedAt.toISOString().slice(0, 19),
    ]),
  );
}

export async function cmdConversationsDelete(
  opts: CliOpts & { id: string; yes?: boolean },
): Promise<void> {
  const rt = initCliRuntime(opts);
  if (!opts.yes) {
    fail('Refusing to delete without --yes');
    process.exitCode = 1;
    return;
  }
  const n = await withPrisma(rt.databaseUrl, async (prisma) => {
    try {
      await prisma.chatConversation.delete({ where: { id: opts.id } });
      return 1;
    } catch {
      return 0;
    }
  });
  if (!n) {
    fail(`Conversation not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  ok(`Deleted conversation ${opts.id}`);
}
