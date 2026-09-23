import { initCliRuntime, emitJson, type CliOpts } from '../lib/runtime-context';
import { fail, info, ok } from '../lib/print';

export async function cmdGrokInspect(opts: CliOpts): Promise<void> {
  initCliRuntime(opts);
  try {
    const { grokInspectService } = await import(
      '../../services/grok-inspect.service'
    );
    const data = await grokInspectService.snapshot();
    if (opts.json) {
      emitJson(data);
      return;
    }
    if (!data.ok) {
      fail(data.error || 'grok inspect failed');
      process.exitCode = 1;
      return;
    }
    ok(`Grok ${data.grokVersion || '?'} · ${data.channel || 'channel?'}`);
    info(`Default model: ${data.defaultModel || '—'}`);
    info(`Models: ${(data.models || []).join(', ') || '—'}`);
    info(
      `Skills ${data.skills} · MCP ${data.mcpServers} · plugins ${data.plugins} · hooks ${data.hooks}`,
    );
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
  }
}

export async function cmdGrokSessionsList(
  opts: CliOpts & { q?: string; cwd?: string; limit?: number },
): Promise<void> {
  initCliRuntime(opts);
  try {
    const { grokSessionsService } = await import(
      '../../services/grok-sessions.service'
    );
    const result = await grokSessionsService.list({
      q: opts.q,
      cwd: opts.cwd,
      limit: opts.limit,
    });
    if (opts.json) {
      emitJson(result);
      return;
    }
    ok(`Grok sessions ${result.data.length}/${result.total}`);
    for (const row of result.data) {
      info(
        `  ${row.id}  ${row.updatedAt?.slice(0, 10) || '—'}  ${row.title}`,
      );
    }
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
  }
}

export async function cmdGrokSessionsDelete(
  opts: CliOpts & { id: string; yes?: boolean },
): Promise<void> {
  initCliRuntime(opts);
  if (!opts.yes) {
    fail('Refusing to delete without --yes');
    process.exitCode = 1;
    return;
  }
  try {
    const { grokSessionsService } = await import(
      '../../services/grok-sessions.service'
    );
    const data = await grokSessionsService.delete(opts.id);
    if (opts.json) {
      emitJson(data);
      return;
    }
    ok(`Deleted Grok session ${data.id}`);
  } catch (e) {
    fail(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
  }
}
