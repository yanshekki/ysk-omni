import { initCliRuntime, emitJson, type CliOpts } from '../lib/runtime-context';
import { fail, info, ok } from '../lib/print';

export async function cmdModels(
  opts: CliOpts & { refresh?: boolean },
): Promise<void> {
  const rt = initCliRuntime(opts);
  // Lazy import after env is set so modelsService/grok sees correct paths
  try {
    const { modelsService } = await import('../../services/models.service');
    const { disconnectDatabase } = await import('../../config/database');
    try {
      const catalog = await modelsService.getModelCatalog(Boolean(opts.refresh));
      if (rt.json) {
        emitJson(catalog);
        return;
      }
      ok(`Models (${catalog.models?.length ?? 0}) · source: ${catalog.source || '—'}`);
      for (const m of catalog.models || []) {
        info(`  ${m}`);
      }
      if (catalog.defaultModel) {
        info(`Default: ${catalog.defaultModel}`);
      }
    } finally {
      await disconnectDatabase().catch(() => undefined);
    }
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
  }
}
