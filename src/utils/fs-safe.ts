import { promises as fs } from 'node:fs';
import path from 'node:path';

/** Best-effort recursive remove (ignore missing / permission errors). */
export async function rmSafe(target: string): Promise<void> {
  if (!target) return;
  try {
    await fs.rm(target, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

/** Ensure parent dir exists and return absolute path. */
export async function ensureDir(dir: string): Promise<string> {
  await fs.mkdir(dir, { recursive: true });
  return path.resolve(dir);
}
