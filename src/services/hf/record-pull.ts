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
import { estimateDiskVram } from './hub-search';

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
  const sha256 = sha256File(result.path);
  const est = estimateDiskVram(spec.repoId, 'llamacpp');
  const entry: RegistryEntry = {
    id: makeEntryId(spec.repoId, quant || undefined),
    repoId: spec.repoId,
    filename: result.file || '',
    path: result.path,
    quant,
    modality: curated?.modality || 'text',
    runtime: curated?.runtime || 'llamacpp',
    vramMb: curated?.vramMb || est.vramMb || 0,
    pulledAt: new Date().toISOString(),
    sha256,
  };
  upsertEntry(entry, registryFile);
  return entry;
}
