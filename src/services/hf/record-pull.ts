import crypto from 'node:crypto';
import fs from 'node:fs';
import { findCuratedPack } from '../../catalog/curated';
import type { PullProgress } from './client';
import {
  makeEntryId,
  upsertEntry,
  type RegistryEntry,
} from './registry';
import { parseHfSpec } from './spec';

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
  if (result.status === 'done' && result.path) return true;
  if (
    result.status === 'skipped' &&
    (result.reason || '').includes('no GGUF file')
  ) {
    return true;
  }
  return false;
}

export function recordPullIfOk(
  specRaw: string,
  result: PullProgress,
  registryFile: string,
): RegistryEntry | null {
  if (!shouldRecordPull(result)) return null;
  const spec = parseHfSpec(specRaw);
  const curated = findCuratedPack(spec.repoId);
  const quant = spec.quant || (result.path ? '' : 'Q4_K_M');
  let sha256 = '';
  if (result.path && fs.existsSync(result.path)) {
    sha256 = sha256File(result.path);
  }
  const entry: RegistryEntry = {
    id: makeEntryId(spec.repoId, quant || undefined),
    repoId: spec.repoId,
    filename: result.file || '',
    path: result.path || '',
    quant,
    modality: curated?.modality || 'text',
    runtime: curated?.runtime || (result.path ? 'llamacpp' : 'vllm'),
    vramMb: curated?.vramMb || 0,
    pulledAt: new Date().toISOString(),
    sha256,
  };
  upsertEntry(entry, registryFile);
  return entry;
}
