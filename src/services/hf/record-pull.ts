import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { findCuratedPack } from '../../catalog/curated';
import type { PullProgress } from './client';
import {
  makeEntryId,
  upsertEntry,
  type RegistryEntry,
} from './registry';
import { inferRuntimeFromFilenames, parseHfSpec } from './spec';
import { estimateDiskVram } from './hub-search';

function listRelFiles(dir: string, prefix = ''): string[] {
  const out: string[] = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (fs.statSync(full).isDirectory()) out.push(...listRelFiles(full, rel));
    else out.push(rel);
  }
  return out;
}

export function sha256File(filePath: string): string {
  const hash = crypto.createHash('sha256');
  const fd = fs.openSync(filePath, 'r');
  try {
    const buf = Buffer.alloc(64 * 1024);
    let n = 0;
    while ((n = fs.readSync(fd, buf, 0, buf.length, null)) > 0) {
      hash.update(buf.subarray(0, n));
    }
  } finally {
    fs.closeSync(fd);
  }
  return hash.digest('hex');
}

export function shouldRecordPull(result: PullProgress): boolean {
  return result.status === 'done' && Boolean(result.path);
}

export function recordPullIfOk(
  specRaw: string,
  result: PullProgress,
  registryFile: string,
): RegistryEntry | null {
  if (!shouldRecordPull(result)) return null;
  const spec = parseHfSpec(specRaw);
  const curated = findCuratedPack(spec.repoId);
  if (!result.path || !fs.existsSync(result.path)) return null;
  const quant = spec.quant || '';
  const st = fs.statSync(result.path);
  const names = st.isDirectory()
    ? listRelFiles(result.path)
    : [result.file || path.basename(result.path)];
  const inferred = inferRuntimeFromFilenames(spec.repoId, names);
  const shaTarget = st.isDirectory()
    ? names.map((n) => path.join(result.path!, n)).find((p) => fs.existsSync(p) && fs.statSync(p).isFile()) || result.path
    : result.path;
  const sha256 = fs.statSync(shaTarget).isFile() ? sha256File(shaTarget) : '';
  const runtime = curated?.runtime || inferred.runtime;
  const est = estimateDiskVram(spec.repoId, runtime === 'vllm' ? 'vllm' : runtime === 'whisper' ? 'whisper' : runtime === 'diffusion' ? 'diffusion' : 'llamacpp');
  const entry: RegistryEntry = {
    id: makeEntryId(spec.repoId, quant || undefined),
    repoId: spec.repoId,
    filename: result.file || (st.isDirectory() ? names[0] || '' : path.basename(result.path)),
    path: result.path,
    quant,
    modality: curated?.modality || inferred.modality,
    runtime,
    vramMb: curated?.vramMb || est.vramMb || 0,
    pulledAt: new Date().toISOString(),
    sha256,
  };
  upsertEntry(entry, registryFile);
  return entry;
}
