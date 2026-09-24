import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { waitForHttp } from './llama-server';

export function vllmBin(): string | null {
  const override = process.env.OMNI_VLLM?.trim();
  if (override) return override;
  const r = spawnSync('which', ['vllm'], { encoding: 'utf8' });
  const p = (r.stdout || '').trim();
  return r.status === 0 && p ? p : null;
}

function whichBin(name: string): string | null {
  const r = spawnSync('which', [name], { encoding: 'utf8' });
  const p = (r.stdout || '').trim();
  return r.status === 0 && p ? p : null;
}

function isPythonBin(file: string): boolean {
  const base = path.basename(file).toLowerCase();
  return base === 'python' || base === 'python3' || /^python\d+(\.\d+)*$/.test(base);
}

function pythonWithVllm(): string | null {
  for (const cand of ['python3', 'python']) {
    const r = spawnSync(cand, ['-c', 'import vllm'], {
      encoding: 'utf8',
      timeout: 8_000,
    });
    if (r.status === 0) return whichBin(cand) || cand;
  }
  return null;
}

export function vllmAvailable(): boolean {
  return Boolean(vllmBin() || pythonWithVllm());
}

export function describeVllmRuntime(): string {
  const override = process.env.OMNI_VLLM?.trim();
  if (override) return override;
  const r = spawnSync('which', ['vllm'], { encoding: 'utf8' });
  const bin = (r.stdout || '').trim();
  if (r.status === 0 && bin) return bin;
  const py = pythonWithVllm();
  if (py) return `${py} -m vllm.entrypoints.openai.api_server`;
  return 'not on PATH';
}

export type VllmLaunch = { command: string; args: string[] };

export function resolveVllmLaunch(hfId: string, port: number): VllmLaunch {
  const hostPort = ['--host', '127.0.0.1', '--port', String(port)];
  const moduleArgs = [
    '-m',
    'vllm.entrypoints.openai.api_server',
    '--model',
    hfId,
    ...hostPort,
  ];
  const forceModule = process.env.OMNI_VLLM_MODULE?.trim() === '1';
  const override = process.env.OMNI_VLLM?.trim();
  if (override) {
    if (forceModule || isPythonBin(override)) {
      return { command: override, args: moduleArgs };
    }
    return { command: override, args: ['serve', hfId, ...hostPort] };
  }
  const bin = vllmBin();
  if (bin && !forceModule) {
    return { command: bin, args: ['serve', hfId, ...hostPort] };
  }
  const py = pythonWithVllm();
  if (py) return { command: py, args: moduleArgs };
  throw new Error('vllm is not on PATH');
}

function pickPort(): number {
  return 20000 + Math.floor(Math.random() * 1000);
}

export async function spawnVllmServe(hfId: string): Promise<{
  child: ChildProcess;
  port: number;
}> {
  const port = pickPort();
  const launch = resolveVllmLaunch(hfId, port);
  const child = spawn(launch.command, launch.args, { stdio: 'ignore' });
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
