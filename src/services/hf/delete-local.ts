import fs from 'node:fs';
import path from 'node:path';
import { omniHome } from '../../config/omni-home';
import { findEntry, removeEntry } from './registry';
import { engineManager, readEnginesState } from '../runtimes/engine-manager';

export async function deleteLocalModel(id: string): Promise<{
  removed: string;
  file: string | null;
}> {
  const entry = findEntry(id);
  if (!entry) {
    throw new Error(`not found: ${id}`);
  }
  const persisted = readEnginesState().loaded.find((e) => e.id === entry.id);
  if (persisted?.pid) {
    try {
      process.kill(persisted.pid, 'SIGTERM');
    } catch {
      /* already gone */
    }
  }
  await engineManager.unload(entry.id);
  let file: string | null = null;
  if (entry.path) {
    const modelsDir = path.resolve(omniHome(), 'models');
    const resolved = path.resolve(entry.path);
    const rel = path.relative(modelsDir, resolved);
    if (!rel.startsWith('..') && !path.isAbsolute(rel) && fs.existsSync(resolved)) {
      fs.unlinkSync(resolved);
      file = resolved;
    }
  }
  removeEntry(entry.id);
  return { removed: entry.id, file };
}
