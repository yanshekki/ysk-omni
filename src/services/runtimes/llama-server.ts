import { spawnSync } from 'node:child_process';

export function llamaServerBin(): string | null {
  const r = spawnSync('which', ['llama-server'], { encoding: 'utf8' });
  const p = (r.stdout || '').trim();
  return r.status === 0 && p ? p : null;
}
