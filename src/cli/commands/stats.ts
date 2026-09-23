import { SETTING_KEYS } from '../../config/constants';
import {
  emitJson,
  initCliRuntime,
  withPrisma,
  type CliOpts,
} from '../lib/runtime-context';
import { info } from '../lib/print';

export async function cmdStats(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const now = new Date();

  const data = await withPrisma(rt.databaseUrl, async (prisma) => {
    const [
      chats,
      chats24h,
      success24h,
      error24h,
      activeKeys,
      totalKeys,
      documents,
      conversations,
      adminSessions,
      jobGroups,
      settings,
    ] = await Promise.all([
      prisma.chatRequest.count(),
      prisma.chatRequest.count({ where: { createdAt: { gte: since24h } } }),
      prisma.chatRequest.count({
        where: { createdAt: { gte: since24h }, status: 'success' },
      }),
      prisma.chatRequest.count({
        where: {
          createdAt: { gte: since24h },
          status: { in: ['error', 'timeout'] },
        },
      }),
      prisma.apiKey.count({ where: { isActive: true } }),
      prisma.apiKey.count(),
      prisma.document.count({ where: { deletedAt: null } }),
      prisma.chatConversation.count(),
      prisma.adminSession.count({ where: { expiresAt: { gt: now } } }),
      prisma.chatJob.groupBy({ by: ['status'], _count: true }),
      prisma.setting.findMany(),
    ]);

    const map = new Map(settings.map((s) => [s.key, s.value]));
    const byStatus: Record<string, number> = {};
    for (const g of jobGroups) byStatus[g.status] = g._count;

    let queuePolicy: Record<string, unknown> | null = null;
    const qp = map.get(SETTING_KEYS.QUEUE_POLICY);
    if (qp) {
      try {
        queuePolicy = JSON.parse(qp) as Record<string, unknown>;
      } catch {
        queuePolicy = null;
      }
    }

    return {
      chats,
      chats24h,
      success24h,
      error24h,
      successRate24h:
        chats24h > 0 ? Math.round((success24h / chats24h) * 1000) / 10 : 0,
      activeKeys,
      totalKeys,
      documents,
      conversations,
      adminSessions,
      globalSafeMode: map.get(SETTING_KEYS.GLOBAL_SAFE_MODE) === 'true',
      defaultModel: map.get(SETTING_KEYS.DEFAULT_MODEL) || '—',
      queueJobs: byStatus,
      queueEnabled: queuePolicy?.enabled ?? null,
      queuePaused: queuePolicy?.paused ?? null,
    };
  });

  if (rt.json) {
    emitJson(data);
    return;
  }

  info('Gateway stats (local DB)');
  info(`  requests 24h:     ${data.chats24h} (ok ${data.success24h} / err ${data.error24h}) · ${data.successRate24h}%`);
  info(`  requests all:     ${data.chats}`);
  info(`  API keys:         ${data.activeKeys}/${data.totalKeys} active`);
  info(`  documents:        ${data.documents}`);
  info(`  conversations:    ${data.conversations}`);
  info(`  OTP sessions:     ${data.adminSessions}`);
  info(`  global safe:      ${data.globalSafeMode ? 'ON' : 'OFF'}`);
  info(`  default model:    ${data.defaultModel}`);
  info(
    `  queue:            enabled=${data.queueEnabled} paused=${data.queuePaused}`,
  );
  const jobs = Object.entries(data.queueJobs);
  if (jobs.length) {
    info(`  queue jobs:       ${jobs.map(([s, n]) => `${s}=${n}`).join(' ')}`);
  }
}
