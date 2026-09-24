import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import {
  hostOs,
  installArgv,
  packageManagerPath,
  whichBin,
} from './runtime-catalog';

const ALLOWED_BINS = new Set([
  'brew',
  'python3',
  'python',
  'pip3',
  'pip',
  'winget',
  'docker',
]);

const STEP_TIMEOUT_MS = 20 * 60 * 1000;

export type InstallEvent =
  | { type: 'start'; id: string }
  | { type: 'step'; index: number; argv: string[] }
  | { type: 'log'; stream: 'stdout' | 'stderr'; line: string }
  | { type: 'done'; code: number }
  | { type: 'error'; message: string };

export type InstallSpawn = (
  command: string,
  args: string[],
  opts: { env: NodeJS.ProcessEnv },
) => Pick<ChildProcess, 'stdout' | 'stderr' | 'on' | 'kill'>;

type ActiveInstall = { id: string; child: Pick<ChildProcess, 'kill'> | null };

let active: ActiveInstall | null = null;

export function isInstallRunning(): boolean {
  return Boolean(active);
}

export function abortInstall(): void {
  try {
    active?.child?.kill('SIGTERM');
  } catch {
    /* ignore */
  }
}

function binBase(p: string): string {
  return path.basename(p).replace(/\.exe$/i, '');
}

function resolveCommand(name: string): string | null {
  if (!ALLOWED_BINS.has(name)) return null;
  return whichBin(name);
}

function installEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    PATH: packageManagerPath(),
    NONINTERACTIVE: '1',
    HOMEBREW_NO_AUTO_UPDATE: '1',
    HOMEBREW_NO_ANALYTICS: '1',
    HOMEBREW_NO_ENV_HINTS: '1',
  };
}

function attachLines(
  stream: NodeJS.ReadableStream | null | undefined,
  which: 'stdout' | 'stderr',
  onEvent: (e: InstallEvent) => void,
): void {
  if (!stream) return;
  let buf = '';
  stream.on('data', (chunk: Buffer | string) => {
    buf += typeof chunk === 'string' ? chunk : chunk.toString('utf8');
    const parts = buf.split(/\r?\n/);
    buf = parts.pop() || '';
    for (const line of parts) {
      if (line.trim()) onEvent({ type: 'log', stream: which, line });
    }
  });
  stream.on('end', () => {
    if (buf.trim()) onEvent({ type: 'log', stream: which, line: buf });
    buf = '';
  });
}

function runArgv(
  argv: string[],
  onEvent: (e: InstallEvent) => void,
  spawnFn: InstallSpawn,
  skipWhich: boolean,
): Promise<number> {
  const name = argv[0];
  if (!name || !ALLOWED_BINS.has(name)) {
    return Promise.reject(new Error(`Blocked installer binary: ${name || '(empty)'}`));
  }
  const resolved = skipWhich ? name : resolveCommand(name);
  if (!resolved) {
    return Promise.reject(
      new Error(`${name} is not on PATH. Install that package manager first.`),
    );
  }
  if (!ALLOWED_BINS.has(binBase(resolved))) {
    return Promise.reject(new Error(`Blocked installer path: ${resolved}`));
  }
  return new Promise((resolve, reject) => {
    const child = spawnFn(resolved, argv.slice(1), { env: installEnv() });
    if (active) active.child = child;
    attachLines(child.stdout, 'stdout', onEvent);
    attachLines(child.stderr, 'stderr', onEvent);
    const timer = setTimeout(() => {
      try {
        child.kill('SIGTERM');
      } catch {
        /* ignore */
      }
      reject(new Error(`Install timed out after ${STEP_TIMEOUT_MS / 60000} minutes`));
    }, STEP_TIMEOUT_MS);
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve(code ?? 1);
    });
  });
}

export async function runInstall(
  id: string,
  onEvent: (e: InstallEvent) => void,
  opts: { spawn?: InstallSpawn } = {},
): Promise<{ ok: boolean; code: number }> {
  const os = hostOs();
  const steps = installArgv(id, os);
  if (!steps.length) {
    const err = `No one-click install for ${id} on ${os}`;
    onEvent({ type: 'error', message: err });
    onEvent({ type: 'done', code: 1 });
    return { ok: false, code: 1 };
  }
  if (active) {
    const err = 'A runtime install is already running';
    onEvent({ type: 'error', message: err });
    onEvent({ type: 'done', code: 1 });
    return { ok: false, code: 1 };
  }
  active = { id, child: null };
  const spawnFn = opts.spawn || spawn;
  const skipWhich = Boolean(opts.spawn);
  onEvent({ type: 'start', id });
  try {
    for (let i = 0; i < steps.length; i += 1) {
      const argv = steps[i];
      onEvent({ type: 'step', index: i, argv });
      const code = await runArgv(argv, onEvent, spawnFn, skipWhich);
      if (code !== 0) {
        onEvent({ type: 'error', message: `Command exited ${code}` });
        onEvent({ type: 'done', code });
        return { ok: false, code };
      }
    }
    onEvent({ type: 'done', code: 0 });
    return { ok: true, code: 0 };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    onEvent({ type: 'error', message });
    onEvent({ type: 'done', code: 1 });
    return { ok: false, code: 1 };
  } finally {
    active = null;
  }
}
