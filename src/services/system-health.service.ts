import execa from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';
import type { SoftwareCheck } from '../interfaces/software-check.interface';
import type { SystemSoftwareReport } from '../interfaces/system-software-report.interface';


function packageRoot(): string {
  return path.resolve(__dirname, '../..');
}

function firstLine(text: string): string {
  return (text || '').trim().split(/\r?\n/)[0]?.trim() || '';
}

function extractVersion(text: string): string | null {
  const line = firstLine(text);
  if (!line) return null;
  const m = line.match(/v?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)/i);
  return m ? m[1] : line.replace(/^v/i, '') || null;
}

async function runVersion(
  bin: string,
  args: string[],
  timeout = 8_000,
): Promise<{ ok: boolean; stdout: string; path: string | null }> {
  try {
    const result = await execa(bin, args, {
      timeout,
      reject: false,
      env: process.env,
    });
    if (result.exitCode !== 0) {
      return { ok: false, stdout: result.stdout || result.stderr || '', path: null };
    }
    return {
      ok: true,
      stdout: result.stdout || result.stderr || '',
      path: bin,
    };
  } catch {
    return { ok: false, stdout: '', path: null };
  }
}

async function which(bin: string): Promise<string | null> {
  try {
    const result = await execa('which', [bin], {
      timeout: 5_000,
      reject: false,
    });
    if (result.exitCode === 0) {
      return firstLine(result.stdout) || null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function nodeMajor(version: string): number {
  const m = version.replace(/^v/, '').match(/^(\d+)/);
  return m ? Number(m[1]) : 0;
}

/**
 * Probe runtime / toolchain software needed by the gateway.
 */
export class SystemHealthService {
  async getSoftwareReport(): Promise<SystemSoftwareReport> {
    const root = packageRoot();
    let pkgVersion = '?';
    let prismaBundled: string | null = null;
    try {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
      ) as {
        version?: string;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      pkgVersion = pkg.version || '?';
      prismaBundled =
        pkg.dependencies?.prisma ||
        pkg.dependencies?.['@prisma/client'] ||
        pkg.devDependencies?.prisma ||
        null;
    } catch {
      /* ignore */
    }

    const [npm, grok, pm2, git, prismaCli] = await Promise.all([
      this.checkNpm(),
      this.checkGrok(),
      this.checkPm2(),
      this.checkGit(),
      this.checkPrismaCli(prismaBundled),
    ]);

    const nodeVersion = process.version.replace(/^v/, '');
    const nodeOk = nodeMajor(process.version) >= 20;
    const node: SoftwareCheck = {
      id: 'node',
      name: 'Node.js',
      level: 'required',
      requiredVersion: '>=20',
      installed: true,
      version: nodeVersion,
      path: process.execPath,
      ok: nodeOk,
      detail: nodeOk ? undefined : 'Node.js 20+ is required',
    };

    const distOk = fs.existsSync(path.join(root, 'dist', 'server.js'));
    const gateway: SoftwareCheck = {
      id: 'gateway',
      name: 'Grok Gateway',
      level: 'bundled',
      installed: true,
      version: pkgVersion,
      path: root,
      ok: distOk,
      detail: distOk ? undefined : 'dist/server.js missing — run npm run build',
    };

    const checks: SoftwareCheck[] = [
      node,
      npm,
      grok,
      pm2,
      prismaCli,
      git,
      gateway,
    ];

    const allRequiredOk = checks
      .filter((c) => c.level === 'required')
      .every((c) => c.ok && c.installed);

    return { allRequiredOk, checks };
  }

  private async checkNpm(): Promise<SoftwareCheck> {
    const binPath = (await which('npm')) || 'npm';
    const r = await runVersion(binPath, ['--version']);
    const version = r.ok ? extractVersion(r.stdout) : null;
    return {
      id: 'npm',
      name: 'npm',
      level: 'recommended',
      installed: r.ok,
      version,
      path: r.ok ? binPath : null,
      ok: r.ok,
      detail: r.ok ? undefined : 'npm not found on PATH',
    };
  }

  private async checkGrok(): Promise<SoftwareCheck> {
    const bin = env.GROK_BIN || 'grok';
    const binPath = (await which(bin)) || bin;
    const r = await runVersion(binPath, ['--version']);
    const version = r.ok ? extractVersion(r.stdout) || firstLine(r.stdout) : null;
    let detail: string | undefined;
    if (!r.ok) {
      detail = `Not found (${bin}). Install Grok CLI and run grok login.`;
    } else if (version) {
      const sem = version.match(/(\d+)\.(\d+)\.(\d+)/);
      if (sem && Number(sem[1]) < 1) {
        detail =
          'Older than 1.0.0 — session and headless flags changed. Run grok update.';
      }
    }
    return {
      id: 'grok',
      name: 'Grok CLI',
      level: 'required',
      installed: r.ok,
      version,
      path: r.ok ? binPath : null,
      ok: r.ok,
      detail,
    };
  }

  private async checkPm2(): Promise<SoftwareCheck> {
    const binPath = (await which('pm2')) || 'pm2';
    const r = await runVersion(binPath, ['-v']);
    const version = r.ok ? extractVersion(r.stdout) : null;
    return {
      id: 'pm2',
      name: 'PM2',
      level: 'optional',
      installed: r.ok,
      version,
      path: r.ok ? binPath : null,
      ok: true, // optional — missing is not a failure of the system
      detail: r.ok
        ? undefined
        : 'Optional. Install for Admin PM2 page: npm i -g pm2',
    };
  }

  private async checkGit(): Promise<SoftwareCheck> {
    const binPath = (await which('git')) || 'git';
    const r = await runVersion(binPath, ['--version']);
    const version = r.ok ? extractVersion(r.stdout) : null;
    const hasGitDir = fs.existsSync(path.join(packageRoot(), '.git'));
    return {
      id: 'git',
      name: 'Git',
      level: hasGitDir ? 'recommended' : 'optional',
      installed: r.ok,
      version,
      path: r.ok ? binPath : null,
      ok: hasGitDir ? r.ok : true,
      detail: r.ok
        ? hasGitDir
          ? 'Git install channel (dev tree)'
          : undefined
        : hasGitDir
          ? 'Git needed for self-update on this install'
          : 'Optional',
    };
  }

  private async checkPrismaCli(
    bundledVersion: string | null,
  ): Promise<SoftwareCheck> {
    // Prefer bundled package version; also try CLI
    let cliVersion: string | null = null;
    let cliPath: string | null = null;
    try {
      const localBin = path.join(packageRoot(), 'node_modules', '.bin', 'prisma');
      const bin = fs.existsSync(localBin) ? localBin : 'prisma';
      const r = await runVersion(bin, ['--version']);
      if (r.ok) {
        const m = r.stdout.match(/prisma\s*[:=]?\s*v?(\d+\.\d+\.\d+)/i);
        cliVersion = m ? m[1] : extractVersion(r.stdout);
        cliPath = bin;
      }
    } catch {
      /* ignore */
    }

    const version = bundledVersion?.replace(/^[^\d]*/, '') || cliVersion;
    const installed = Boolean(version || cliVersion);
    return {
      id: 'prisma',
      name: 'Prisma',
      level: 'bundled',
      requiredVersion: bundledVersion || undefined,
      installed,
      version: version || null,
      path: cliPath,
      ok: installed,
      detail: installed ? 'Bundled with gateway' : 'Prisma not found',
    };
  }
}

export const systemHealthService = new SystemHealthService();
