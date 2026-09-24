import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { waitForHttp } from './llama-server';

export function vllmBin(): string | null {
  const override = process.env.OMNI_VLLM?.trim();
  if (override) return override;
  const r = spawnSync('which', ['vllm'], { encoding: 'utf8' });
  const p = (r.stdout || '').trim();
  return r.status === 0 && p ? p : null;
}

function pickPort(): number {
  return 20000 + Math.floor(Math.random() * 1000);
}

export async function spawnVllmServe(hfId: string): Promise<{
  child: ChildProcess;
  port: number;
}> {
  const bin = vllmBin();
  if (!bin) throw new Error('vllm is not on PATH');
  const port = pickPort();
  const child = spawn(
    bin,
    ['serve', hfId, '--host', '127.0.0.1', '--port', String(port)],
    { stdio: 'ignore' },
  );
  try {
    await waitForHttp(`http://127.0.0.1:${port}/v1/models`, 120_000);
    return { child, port };
  } catch (err) {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
    throw err;
  }
}
