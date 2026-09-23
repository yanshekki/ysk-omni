import { spawnSync } from 'node:child_process';

export function vllmBin(): string | null {
  const r = spawnSync('which', ['vllm'], { encoding: 'utf8' });
  const p = (r.stdout || '').trim();
  return r.status === 0 && p ? p : null;
}
