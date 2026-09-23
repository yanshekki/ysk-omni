import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import type { RuntimePaths } from './paths';
import {
  findPidsOnPort,
  isProcessRunning,
  readPid,
} from './process-mgr';

export type RunnerKind = 'ysk-omni' | 'pm2' | 'none' | 'mixed' | 'unknown';

export function readPreferredRunner(
  packageRoot: string,
): 'pm2' | 'ysk-omni' | null {
  try {
    const p = path.join(packageRoot, 'pm2.runtime.json');
    if (!fs.existsSync(p)) return null;
    const j = JSON.parse(fs.readFileSync(p, 'utf8')) as {
      preferred_runner?: string;
    };
    if (j.preferred_runner === 'pm2' || j.preferred_runner === 'ysk-omni') {
      return j.preferred_runner;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function readPm2AppName(packageRoot: string): string {
  try {
    const p = path.join(packageRoot, 'pm2.runtime.json');
    if (fs.existsSync(p)) {
      const j = JSON.parse(fs.readFileSync(p, 'utf8')) as { name?: string };
      if (j.name) return j.name;
    }
  } catch {
    /* ignore */
  }
  return 'ysk-omni';
}

function whichPm2(): string | null {
  try {
    return execFileSync('which', ['pm2'], { encoding: 'utf8' }).trim() || null;
  } catch {
    return null;
  }
}

export function pm2AppStatus(packageRoot: string): {
  available: boolean;
  online: boolean;
  status: string | null;
  pid: number | null;
  name: string;
} {
  const name = readPm2AppName(packageRoot);
  const bin = whichPm2();
  if (!bin) {
    return {
      available: false,
      online: false,
      status: null,
      pid: null,
      name,
    };
  }
  try {
    const jlist = execFileSync(bin, ['jlist'], {
      encoding: 'utf8',
      cwd: packageRoot,
      timeout: 8_000,
    });
    const list = JSON.parse(jlist || '[]') as Array<{
      name?: string;
      pid?: number;
      pm2_env?: { status?: string; pm_pid?: number };
    }>;
    const app = list.find((a) => a.name === name);
    if (!app) {
      return {
        available: true,
        online: false,
        status: 'not in list',
        pid: null,
        name,
      };
    }
    const status = app.pm2_env?.status || 'unknown';
    const pid = app.pm2_env?.pm_pid || app.pid || null;
    const online =
      (status === 'online' || status === 'launching') &&
      Boolean(pid && pid > 0);
    return { available: true, online, status, pid, name };
  } catch {
    return {
      available: true,
      online: false,
      status: 'error',
      pid: null,
      name,
    };
  }
}

export function detectRunner(
  paths: RuntimePaths,
  port: number,
): {
  runner: RunnerKind;
  preferred: 'pm2' | 'ysk-omni' | null;
  omniPid: number | null;
  omniRunning: boolean;
  pm2: ReturnType<typeof pm2AppStatus>;
  portPids: number[];
} {
  const omniPid = readPid(paths.pidFile);
  const omniRunning = Boolean(omniPid && isProcessRunning(omniPid));
  const pm2 = pm2AppStatus(paths.packageRoot);
  const preferred = readPreferredRunner(paths.packageRoot);
  const portPids = findPidsOnPort(port);

  let runner: RunnerKind = 'none';
  if (pm2.online && omniRunning) runner = 'mixed';
  else if (pm2.online) runner = 'pm2';
  else if (omniRunning) runner = 'ysk-omni';
  else if (portPids.length) runner = 'unknown';

  return {
    runner,
    preferred,
    omniPid: omniRunning ? omniPid : null,
    omniRunning,
    pm2,
    portPids,
  };
}
