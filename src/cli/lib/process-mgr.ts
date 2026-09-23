import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import type { RuntimePaths } from './paths';

export function readPid(pidFile: string): number | null {
  try {
    if (!fs.existsSync(pidFile)) return null;
    const n = Number(fs.readFileSync(pidFile, 'utf8').trim());
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function writePid(pidFile: string, pid: number): void {
  fs.mkdirSync(path.dirname(pidFile), { recursive: true });
  fs.writeFileSync(pidFile, String(pid), 'utf8');
}

export function clearPid(pidFile: string): void {
  try {
    fs.unlinkSync(pidFile);
  } catch {
    /* ignore */
  }
}

/**
 * Find PIDs listening on a TCP port (Linux ss/fuser/lsof fallbacks).
 */
export function findPidsOnPort(port: number): number[] {
  const pids = new Set<number>();

  // ss -lptn 'sport = :PORT'
  try {
    const out = execFileSync(
      'ss',
      ['-lptn', `sport = :${port}`],
      { encoding: 'utf8', timeout: 3000 },
    );
    for (const m of out.matchAll(/pid=(\d+)/g)) {
      const n = Number(m[1]);
      if (n > 0) pids.add(n);
    }
  } catch {
    /* try next */
  }

  if (pids.size === 0) {
    try {
      const out = execFileSync('fuser', [`${port}/tcp`], {
        encoding: 'utf8',
        timeout: 3000,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      for (const part of out.trim().split(/\s+/)) {
        const n = Number(part);
        if (n > 0) pids.add(n);
      }
    } catch {
      /* try next */
    }
  }

  if (pids.size === 0) {
    try {
      const out = execFileSync('lsof', ['-t', `-i:${port}`, '-sTCP:LISTEN'], {
        encoding: 'utf8',
        timeout: 3000,
      });
      for (const line of out.split(/\n/)) {
        const n = Number(line.trim());
        if (n > 0) pids.add(n);
      }
    } catch {
      /* ignore */
    }
  }

  // Never kill ourselves
  pids.delete(process.pid);
  return [...pids];
}

export async function killPid(
  pid: number,
  timeoutMs = 10_000,
): Promise<boolean> {
  if (!isProcessRunning(pid)) return false;
  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    return false;
  }
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (!isProcessRunning(pid)) return true;
    await new Promise((r) => setTimeout(r, 200));
  }
  try {
    process.kill(pid, 'SIGKILL');
  } catch {
    /* ignore */
  }
  return !isProcessRunning(pid);
}

export function startDetached(paths: RuntimePaths, env: NodeJS.ProcessEnv): number {
  const serverJs = path.join(paths.packageRoot, 'dist', 'server.js');
  if (!fs.existsSync(serverJs)) {
    throw new Error(`Server not built: ${serverJs}. Run npm run build first.`);
  }

  const outLog = path.join(paths.logsDir, 'gctoac.out.log');
  const errLog = path.join(paths.logsDir, 'gctoac.err.log');
  const outFd = fs.openSync(outLog, 'a');
  const errFd = fs.openSync(errLog, 'a');

  const child = spawn(process.execPath, [serverJs], {
    detached: true,
    stdio: ['ignore', outFd, errFd],
    env: {
      ...process.env,
      ...env,
      GCTOAC_HOME: paths.home,
    },
    cwd: paths.packageRoot,
  });

  // Close parent copies of log FDs so the CLI event loop can exit
  try {
    fs.closeSync(outFd);
  } catch {
    /* ignore */
  }
  try {
    fs.closeSync(errFd);
  } catch {
    /* ignore */
  }

  child.unref();
  if (!child.pid) {
    throw new Error('Failed to spawn server process');
  }
  writePid(paths.pidFile, child.pid);
  return child.pid;
}

export async function stopProcess(pidFile: string, timeoutMs = 10_000): Promise<boolean> {
  const pid = readPid(pidFile);
  if (!pid) return false;
  if (!isProcessRunning(pid)) {
    clearPid(pidFile);
    return false;
  }

  const ok = await killPid(pid, timeoutMs);
  clearPid(pidFile);
  return ok;
}

/**
 * Stop by pid file and/or any process listening on port (orphan cleanup).
 */
export async function stopGateway(opts: {
  pidFile: string;
  port: number;
}): Promise<{ stoppedPid: boolean; freedPort: number[] }> {
  let stoppedPid = false;
  const pid = readPid(opts.pidFile);
  if (pid && isProcessRunning(pid)) {
    stoppedPid = await killPid(pid);
  }
  clearPid(opts.pidFile);

  const onPort = findPidsOnPort(opts.port);
  const freedPort: number[] = [];
  for (const p of onPort) {
    // Don't kill if we already handled the same pid
    if (pid && p === pid) continue;
    const killed = await killPid(p);
    if (killed) freedPort.push(p);
  }

  // Final sweep if still occupied
  await new Promise((r) => setTimeout(r, 300));
  for (const p of findPidsOnPort(opts.port)) {
    await killPid(p, 3000);
    if (!freedPort.includes(p)) freedPort.push(p);
  }

  return { stoppedPid, freedPort };
}
