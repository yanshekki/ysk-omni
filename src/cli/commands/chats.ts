import {
  emitJson,
  initCliRuntime,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { printTable } from '../lib/print-table';
import { fail, info } from '../lib/print';

export async function cmdChatsList(
  opts: CliOpts & {
    status?: string;
    limit?: number;
    offset?: number;
  },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);
  const where: Record<string, unknown> = {};
  if (opts.status) where.status = opts.status;

  const { rows, total } = await withPrisma(rt.databaseUrl, async (prisma) => {
    const [rows, total] = await Promise.all([
      prisma.chatRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          requestId: true,
          model: true,
          status: true,
          stream: true,
          durationMs: true,
          policyMode: true,
          createdAt: true,
          apiKey: { select: { name: true, keyPrefix: true } },
        },
      }),
      prisma.chatRequest.count({ where }),
    ]);
    return { rows, total };
  });

  if (rt.json) {
    emitJson({ total, limit, offset, data: rows });
    return;
  }
  info(`Chat requests: ${total}`);
  printTable(
    ['id', 'status', 'model', 'mode', 'ms', 'key', 'time'],
    rows.map((c) => [
      c.requestId.slice(0, 14),
      c.status,
      c.model.slice(0, 14),
      c.policyMode || '—',
      c.durationMs ?? '—',
      c.apiKey?.name?.slice(0, 12) || '—',
      c.createdAt.toISOString().slice(0, 19),
    ]),
  );
}

export async function cmdChatsShow(
  opts: CliOpts & { id: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const chat = await withPrisma(rt.databaseUrl, (prisma) =>
    prisma.chatRequest.findFirst({
      where: {
        OR: [{ id: opts.id }, { requestId: opts.id }],
      },
      select: {
        id: true,
        requestId: true,
        model: true,
        status: true,
        stream: true,
        durationMs: true,
        policyMode: true,
        grokSessionId: true,
        createdAt: true,
        apiKeyId: true,
        apiKey: { select: { name: true, keyPrefix: true } },
        ip: true,
      },
    }),
  );
  if (!chat) {
    fail(`Chat not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  if (rt.json) emitJson(chat);
  else {
    info(`Chat ${chat.id}`);
    info(`  requestId:    ${chat.requestId}`);
    info(`  status:       ${chat.status}`);
    info(`  model:        ${chat.model}`);
    info(`  policyMode:   ${chat.policyMode ?? '—'}`);
    info(`  durationMs:   ${chat.durationMs ?? '—'}`);
    info(`  stream:       ${chat.stream}`);
    info(`  apiKey:       ${chat.apiKey?.name ?? chat.apiKeyId}`);
    info(`  grokSession:  ${chat.grokSessionId ?? '—'}`);
    info(`  ip:           ${chat.ip ?? '—'}`);
    info(`  createdAt:    ${chat.createdAt.toISOString()}`);
    info('');
    info('Full prompt/response are encrypted — open Admin → Chat history to decrypt.');
  }
}
