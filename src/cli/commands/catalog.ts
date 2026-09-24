import { loadCuratedPacks, type CuratedPack } from '../../catalog/curated';
import { parseHfSpec, listQuants } from '../../services/hf/spec';
import { listHubFiles, pullModel } from '../../services/hf/client';
import { recordPullIfOk } from '../../services/hf/record-pull';
import {
  findEntry,
  loadRegistry,
  removeEntry,
} from '../../services/hf/registry';
import { initCliRuntime, emitJson, type CliOpts } from '../lib/runtime-context';
import { fail, info, ok } from '../lib/print';
import path from 'node:path';
import { ECHO_MODEL_ID } from '../../services/runtimes/echo';

function printPack(p: CuratedPack): void {
  const q = p.quants.length ? p.quants.join(', ') : '(safetensors / no GGUF list)';
  info(`  ${p.id}  [${p.modality}/${p.runtime}]  quants: ${q}`);
}

export async function cmdCatalog(
  opts: CliOpts & { modality?: string },
): Promise<void> {
  initCliRuntime(opts);
  const packs = loadCuratedPacks().filter((p) =>
    opts.modality ? p.modality === opts.modality : true,
  );
  if (opts.json) {
    emitJson({ packs });
    return;
  }
  ok(`Curated catalog (${packs.length})`);
  for (const p of packs) printPack(p);
}

export async function cmdShow(opts: CliOpts & { spec: string }): Promise<void> {
  initCliRuntime(opts);
  const spec = parseHfSpec(opts.spec);
  const packs = loadCuratedPacks();
  const curated = packs.find(
    (p) => p.repoId === spec.repoId || p.id === spec.repoId,
  );
  let quants = curated?.quants ? [...curated.quants] : [];
  try {
    const files = await listHubFiles(spec.repoId);
    const fromHub = listQuants(files);
    for (const q of fromHub) {
      if (!quants.includes(q)) quants.push(q);
    }
  } catch {
    /* curated list is enough for offline show */
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
  if (result.status === 'done' && entry) {
    ok(`Pulled ${entry.id} → ${entry.path} sha256=${entry.sha256.slice(0, 12)}…`);
  } else if (entry) {
    info(`Recorded ${entry.id} (${result.status}${result.reason ? `: ${result.reason}` : ''})`);
  } else {
    fail(`Pull did not record a registry entry (${result.status}${result.reason ? `: ${result.reason}` : ''})`);
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
  const rt = initCliRuntime(opts);
  const file = path.join(rt.paths.home, 'registry.json');
  const hit = findEntry(opts.id, file);
  const okDel = removeEntry(hit?.id || opts.id, file);
  if (!okDel) {
    fail(`not found: ${opts.id}`);
    process.exitCode = 1;
    return;
  }
  if (opts.json) {
    emitJson({ removed: hit?.id || opts.id });
    return;
  }
  ok(`Removed ${hit?.id || opts.id}`);
}
