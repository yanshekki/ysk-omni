import { parseHfSpec, listQuants } from '../../services/hf/spec';
import { listHubFiles, pullModel } from '../../services/hf/client';
import { recordPullIfOk } from '../../services/hf/record-pull';
import { findEntry, loadRegistry } from '../../services/hf/registry';
import { deleteLocalModel } from '../../services/hf/delete-local';
import {
  loadPopularCache,
  searchHub,
  syncPopularGguf,
} from '../../services/hf/hub-search';
import {
  engineManager,
  readEnginesState,
} from '../../services/runtimes/engine-manager';
import { initCliRuntime, emitJson, type CliOpts } from '../lib/runtime-context';
import { fail, info, ok } from '../lib/print';
import path from 'node:path';
import { ECHO_MODEL_ID } from '../../services/runtimes/echo';

export async function cmdCatalog(
  opts: CliOpts & { modality?: string },
): Promise<void> {
  const rt = initCliRuntime(opts);
  const file = path.join(rt.paths.home, 'registry.json');
  const models = loadRegistry(file).models.filter((m) =>
    opts.modality ? m.modality === opts.modality : true,
  );
  const popular = loadPopularCache();
  if (opts.json) {
    emitJson({ models, popular: popular?.hits || [], popularSyncedAt: popular?.syncedAt || null });
    return;
  }
  ok(`Local models (${models.length})`);
  for (const m of models) {
    info(`  ${m.id}  [${m.modality}/${m.runtime}]  ${m.path || '(no file)'}`);
  }
  if (popular?.hits?.length) {
    ok(`Synced popular GGUF (${popular.hits.length})  ${popular.syncedAt}`);
    for (const h of popular.hits.slice(0, 12)) {
      info(`  ${h.id}  [${h.modality}/${h.runtime}]  ${h.downloads}`);
    }
    if (popular.hits.length > 12) info(`  … ${popular.hits.length - 12} more (catalog search / Admin)`);
  }
}

export async function cmdShow(opts: CliOpts & { spec: string }): Promise<void> {
  initCliRuntime(opts);
  const spec = parseHfSpec(opts.spec);
  let quants: string[] = [];
  try {
    const files = await listHubFiles(spec.repoId);
    quants = listQuants(files);
  } catch {
    /* Hub unavailable */
  }
  if (opts.json) {
    emitJson({ repoId: spec.repoId, quant: spec.quant, quants });
    return;
  }
  ok(`${spec.repoId}`);
  if (!quants.length) {
    info('  (no GGUF quants listed — safetensors or Hub unavailable)');
    return;
  }
  info('  quants:');
  for (const q of quants) {
    info(`    ${q}${spec.quant && spec.quant.toUpperCase() === q ? '  (requested)' : ''}`);
  }
}

export async function cmdPull(opts: CliOpts & { spec: string }): Promise<void> {
  const rt = initCliRuntime(opts);
  const destDir = path.join(rt.paths.home, 'models');
  const result = await pullModel(opts.spec, destDir, (p) => {
    if (opts.json) return;
    if (p.status === 'downloading') {
      info(`  ${p.file || ''} ${p.bytes || 0}${p.total ? `/${p.total}` : ''}`);
    } else if (p.reason) {
      info(`  ${p.status}: ${p.reason}`);
    }
  });
  const registryFile = path.join(rt.paths.home, 'registry.json');
  const entry = recordPullIfOk(opts.spec, result, registryFile);
  if (opts.json) {
    emitJson({ result, entry });
    return;
  }
  if (result.status === 'done' && entry?.path) {
    ok(`Pulled ${entry.id} → ${entry.path} sha256=${entry.sha256.slice(0, 12)}…`);
  } else {
    fail(
      `Pull did not save a local GGUF (${result.status}${result.reason ? `: ${result.reason}` : ''})`,
    );
    process.exitCode = 1;
  }
}

export async function cmdLocalModels(opts: CliOpts): Promise<void> {
  const rt = initCliRuntime(opts);
  const file = path.join(rt.paths.home, 'registry.json');
  const models = loadRegistry(file).models;
  if (opts.json) {
    emitJson({ echo: ECHO_MODEL_ID, models });
    return;
  }
  ok(`Local models (${models.length}) + ${ECHO_MODEL_ID}`);
  info(`  ${ECHO_MODEL_ID}  [text/echo]`);
  for (const m of models) {
    info(`  ${m.id}  [${m.modality}/${m.runtime}]  ${m.path || '(no file)'}`);
  }
}

export async function cmdRm(opts: CliOpts & { id: string }): Promise<void> {
  initCliRuntime(opts);
  try {
    const out = await deleteLocalModel(opts.id);
    if (opts.json) {
      emitJson(out);
      return;
    }
    ok(`Removed ${out.removed}${out.file ? ` and deleted ${out.file}` : ''}`);
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

export async function cmdCatalogSearch(
  opts: CliOpts & { q?: string; modality?: string },
): Promise<void> {
  initCliRuntime(opts);
  try {
    const data = await searchHub({
      q: opts.q,
      modality: opts.modality,
      limit: 24,
    });
    if (opts.json) {
      emitJson(data);
      return;
    }
    ok(`Hub search (${data.hits.length})`);
    for (const h of data.hits) {
      info(
        `  ${h.id}  [${h.modality}/${h.runtime}]  ${h.sizeMb || '—'}MB disk / ${h.vramMb || '—'}MB VRAM  dl=${h.downloads}`,
      );
    }
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

export async function cmdCatalogSync(opts: CliOpts): Promise<void> {
  initCliRuntime(opts);
  try {
    const cache = await syncPopularGguf();
    if (opts.json) {
      emitJson({ count: cache.hits.length, syncedAt: cache.syncedAt, hits: cache.hits });
      return;
    }
    ok(`Synced ${cache.hits.length} popular GGUF ids (metadata only)`);
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

export async function cmdLoad(opts: CliOpts & { id: string }): Promise<void> {
  initCliRuntime(opts);
  const entry = findEntry(opts.id);
  if (!entry) {
    fail(`not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  try {
    if (entry.runtime === 'whisper' || entry.runtime === 'diffusion') {
      if (opts.json) {
        emitJson({ id: entry.id, kind: entry.runtime, path: entry.path });
        return;
      }
      ok(`Ready ${entry.id} (${entry.runtime}) at ${entry.path}`);
      return;
    }
    const isGguf = Boolean(entry.path?.toLowerCase().endsWith('.gguf'));
    const eng =
      isGguf || entry.runtime === 'llamacpp'
        ? await engineManager.loadGguf(entry)
        : await engineManager.loadVllm(entry);
    if (opts.json) {
      emitJson({ id: eng.id, port: eng.port, kind: eng.kind });
      return;
    }
    ok(`Loaded ${eng.id} on 127.0.0.1:${eng.port} (${eng.kind})`);
  } catch (err) {
    fail(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  }
}

export async function cmdUnload(opts: CliOpts & { id: string }): Promise<void> {
  initCliRuntime(opts);
  const removed = await engineManager.unload(opts.id);
  const row = readEnginesState().loaded.find((e) => e.id === opts.id);
  if (row?.pid) {
    try {
      process.kill(row.pid, 'SIGTERM');
    } catch {
      /* ignore */
    }
  }
  if (opts.json) {
    emitJson({ unloaded: removed || Boolean(row) });
    return;
  }
  if (removed || row) ok(`Unloaded ${opts.id}`);
  else {
    fail(`not loaded: ${opts.id}`);
    process.exitCode = 1;
  }
}
