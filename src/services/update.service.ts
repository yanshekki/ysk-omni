import {
  execFileSync,
  execSync,
  spawn,
  spawnSync,
} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ExceptionFactory } from '../exceptions/exception.factory';
import type { InstallChannel } from '../interfaces/install-channel.type';
import type { UpdateProgress } from '../interfaces/update-progress.type';
import type { UpdateResult } from '../interfaces/update-result.interface';
import type { VersionInfo } from '../interfaces/version-info.interface';
import type { VersionStatus } from '../interfaces/version-status.type';


const PRISMA_VERSION = '6.5.0';

export const GITHUB_REPO = 'yanshekki/Grok-Cli-to-OpenAI-compatible';
export const NPM_PACKAGE = 'grok-cli-to-openai-compatible';

function getPackageRoot(): string {
  // dist/services -> dist -> package root
  return path.resolve(__dirname, '../..');
}

function readLocalPackage(): {
  name: string;
  version: string;
  _from?: string;
  _resolved?: string;
} {
  const pkgPath = path.join(getPackageRoot(), 'package.json');
  return JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
    name: string;
    version: string;
    _from?: string;
    _resolved?: string;
  };
}

function detectChannel(packageRoot: string): {
  channel: InstallChannel;
  installSource: string;
} {
  if (fs.existsSync(path.join(packageRoot, '.git'))) {
    return { channel: 'git', installSource: 'git working tree' };
  }

  // npm global typically under .../lib/node_modules/<name>
  const normalized = packageRoot.replace(/\\/g, '/');
  if (normalized.includes('/node_modules/')) {
    try {
      const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
      if (packageRoot.startsWith(path.resolve(globalRoot))) {
        return {
          channel: 'npm-global',
          installSource: `npm global (${globalRoot})`,
        };
      }
    } catch {
      /* ignore */
    }
    return { channel: 'npm-local', installSource: 'npm local node_modules' };
  }

  // package.json may still live in a non-node_modules path after pack extract
  try {
    const pkg = readLocalPackage();
    if (pkg._resolved?.includes('github.com') || pkg._from?.includes('github:')) {
      return {
        channel: 'npm-global',
        installSource: pkg._from || pkg._resolved || 'github',
      };
    }
  } catch {
    /* ignore */
  }

  return { channel: 'unknown', installSource: packageRoot };
}

function compareSemver(a: string, b: string): number {
  const pa = a.replace(/^v/, '').split('.').map((x) => Number(x) || 0);
  const pb = b.replace(/^v/, '').split('.').map((x) => Number(x) || 0);
  for (let i = 0; i < 3; i += 1) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

async function fetchLatestNpm(): Promise<string | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${NPM_PACKAGE}/latest`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { version?: string };
    return body.version ?? null;
  } catch {
    return null;
  }
}

async function fetchLatestGithub(): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'gctoac-update',
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (res.ok) {
      const body = (await res.json()) as { tag_name?: string };
      if (body.tag_name) return body.tag_name.replace(/^v/, '');
    }
    // fallback: latest commit on main (not a version, skip)
    const tags = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/tags?per_page=1`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'gctoac-update',
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (tags.ok) {
      const arr = (await tags.json()) as Array<{ name?: string }>;
      if (arr[0]?.name) return arr[0].name.replace(/^v/, '');
    }
    return null;
  } catch {
    return null;
  }
}

function run(
  cmd: string,
  cwd: string,
  log: string[],
  env?: NodeJS.ProcessEnv,
  live = false,
): void {
  log.push(`$ ${cmd}`);
  if (live && process.stdout.isTTY) {
    // Stream child output so the user sees npm/git progress in real time
    const result = spawnSync(cmd, {
      cwd,
      env: { ...process.env, ...env },
      shell: true,
      stdio: 'inherit',
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    });
    if (result.status !== 0 && result.status !== null) {
      throw new Error(`Command failed (exit ${result.status}): ${cmd}`);
    }
    return;
  }
  const out = execSync(cmd, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ...env },
    maxBuffer: 20 * 1024 * 1024,
  });
  if (out?.trim()) log.push(out.trim());
}

/**
 * Prefer local prisma package (no flaky npx cache). Falls back to npm exec.
 */
function runPrisma(
  args: string[],
  packageRoot: string,
  log: string[],
  env?: NodeJS.ProcessEnv,
  live = false,
): void {
  const entry = path.join(packageRoot, 'node_modules', 'prisma', 'build', 'index.js');
  const runEnv = { ...process.env, ...env };
  if (fs.existsSync(entry)) {
    log.push(`$ node prisma ${args.join(' ')}`);
    if (live && process.stdout.isTTY) {
      const result = spawnSync(process.execPath, [entry, ...args], {
        cwd: packageRoot,
        env: runEnv,
        stdio: 'inherit',
        encoding: 'utf8',
      });
      if (result.status !== 0 && result.status !== null) {
        throw new Error(`prisma ${args.join(' ')} failed (exit ${result.status})`);
      }
      return;
    }
    const out = execFileSync(process.execPath, [entry, ...args], {
      cwd: packageRoot,
      encoding: 'utf8',
      env: runEnv,
      maxBuffer: 20 * 1024 * 1024,
    });
    if (out?.trim()) log.push(out.trim());
    return;
  }
  run(
    `npx --yes prisma@${PRISMA_VERSION} ${args.map((a) => JSON.stringify(a)).join(' ')}`,
    packageRoot,
    log,
    runEnv,
    live,
  );
}

function gitInstallAndBuild(
  packageRoot: string,
  log: string[],
  live: boolean,
  doStep: (title: string, fn: () => void) => void,
): void {
  const allowDev = process.env.GCTOAC_UPDATE_DEV === '1';
  if (allowDev) {
    doStep('npm install --include=dev', () => {
      run(
        'npm install --include=dev',
        packageRoot,
        log,
        { NODE_ENV: 'development' },
        live,
      );
    });
    doStep('npm run build (compile)', () => {
      run(
        'npm run build',
        packageRoot,
        log,
        { NODE_ENV: 'development' },
        live,
      );
    });
    return;
  }
  doStep('npm install (production)', () => {
    run(
      'npm install --omit=dev',
      packageRoot,
      log,
      { NODE_ENV: 'production' },
      live,
    );
  });
  doStep('compile with npx (no local devDependencies)', () => {
    run(
      `node scripts/generate-allowed-extensions.cjs`,
      packageRoot,
      log,
      undefined,
      live,
    );
    run(
      `npx --yes prisma@${PRISMA_VERSION} generate`,
      packageRoot,
      log,
      undefined,
      live,
    );
    run(
      'npx --yes --package typescript@5.8 tsc -p tsconfig.json',
      packageRoot,
      log,
      undefined,
      live,
    );
    run(
      'node -e "require(\'fs\').chmodSync(\'dist/cli/index.js\',0o755)"',
      packageRoot,
      log,
      undefined,
      live,
    );
    run(
      'npx --yes --package vite@6.4.3 vite build --config admin/vite.config.ts',
      packageRoot,
      log,
      undefined,
      live,
    );
  });
}

/** Generate client + migrate deploy against the given DATABASE_URL. */
export function runPostUpdateMigrate(
  packageRoot: string,
  databaseUrl: string,
  log: string[],
  live = false,
): void {
  const env = { DATABASE_URL: databaseUrl };
  try {
    runPrisma(['generate'], packageRoot, log, env, live);
  } catch (e) {
    log.push(`prisma generate warn: ${e instanceof Error ? e.message : e}`);
  }
  try {
    runPrisma(['migrate', 'deploy'], packageRoot, log, env, live);
    log.push('Database migrations applied (migrate deploy)');
  } catch (e) {
    log.push(`migrate deploy warn: ${e instanceof Error ? e.message : e}`);
    run(
      `npx --yes prisma@${PRISMA_VERSION} migrate deploy`,
      packageRoot,
      log,
      env,
      live,
    );
    log.push('Database migrations applied (npx fallback)');
  }
}

export class UpdateService {
  private updating = false;

  isUpdating(): boolean {
    return this.updating;
  }

  async getVersionInfo(): Promise<VersionInfo> {
    const packageRoot = getPackageRoot();
    const pkg = readLocalPackage();
    const { channel, installSource } = detectChannel(packageRoot);
    const [latestNpm, latestGithub] = await Promise.all([
      fetchLatestNpm(),
      fetchLatestGithub(),
    ]);

    // Prefer npm latest when available; else GitHub tag
    const latest = latestNpm || latestGithub;
    let versionStatus: VersionStatus = 'unknown';
    let updateAvailable = false;

    if (latest) {
      const cmp = compareSemver(latest, pkg.version);
      if (cmp > 0) {
        versionStatus = 'update_available';
        updateAvailable = true;
      } else if (cmp < 0) {
        // Local ahead of registry (typical for git / unpublished bumps)
        versionStatus = 'ahead';
        updateAvailable = false;
      } else {
        versionStatus = 'up_to_date';
        updateAvailable = false;
      }
    }

    return {
      current: pkg.version,
      latestNpm,
      latestGithub,
      latest,
      updateAvailable,
      versionStatus,
      channel,
      packageRoot,
      installSource,
    };
  }

  async performUpdate(options?: {
    channel?: InstallChannel | 'auto';
    skipMigrate?: boolean;
    /** Absolute SQLite/file DATABASE_URL for migrate deploy (user data home) */
    databaseUrl?: string;
    /** Stream command output + progress hooks (CLI) */
    live?: boolean;
    progress?: UpdateProgress;
  }): Promise<UpdateResult> {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      throw ExceptionFactory.validation(
        'Refusing system update while NODE_ENV=test / VITEST',
      );
    }
    if (this.updating) {
      throw ExceptionFactory.validation('Update already in progress');
    }
    this.updating = true;
    const log: string[] = [];
    const packageRoot = getPackageRoot();
    const fromVersion = readLocalPackage().version;
    const detected = detectChannel(packageRoot);
    const channel =
      options?.channel && options.channel !== 'auto'
        ? options.channel
        : detected.channel;
    const live = Boolean(options?.live);
    const progress = options?.progress;
    const hasGit = fs.existsSync(path.join(packageRoot, '.git'));
    const willMigrate = !options?.skipMigrate;

    // Keep total in sync with every doStep() call below
    let total: number;
    if (channel === 'git') {
      total = 4; // fetch, pull, npm install, build
    } else if (channel === 'npm-global' || channel === 'npm-local') {
      total = 1;
    } else if (hasGit) {
      total = 3; // pull, npm install, build
    } else {
      total = 1; // npm install -g package
    }
    total += 1; // always: npm install -g pm2
    if (willMigrate) total += 1; // prisma generate + migrate

    let stepIndex = 0;
    const doStep = (title: string, fn: () => void): void => {
      stepIndex += 1;
      progress?.step?.({ index: stepIndex, total, title });
      progress?.start?.(title);
      log.push(`── step ${stepIndex}/${total}: ${title}`);
      try {
        fn();
        progress?.succeed?.(title);
      } catch (e) {
        progress?.fail?.(title);
        throw e;
      }
    };

    try {
      log.push(`channel=${channel} root=${packageRoot} steps=${total}`);

      if (channel === 'git') {
        doStep('git fetch --all --tags', () => {
          run('git fetch --all --tags', packageRoot, log, undefined, live);
        });
        doStep('git pull --ff-only', () => {
          run('git pull --ff-only', packageRoot, log, undefined, live);
        });
        gitInstallAndBuild(packageRoot, log, live, doStep);
      } else if (channel === 'npm-global') {
        doStep(`npm install -g ${NPM_PACKAGE}@latest`, () => {
          run(
            `npm install -g ${NPM_PACKAGE}@latest`,
            packageRoot,
            log,
            undefined,
            live,
          );
        });
      } else if (channel === 'npm-local') {
        doStep(`npm install ${NPM_PACKAGE}@latest`, () => {
          run(
            `npm install ${NPM_PACKAGE}@latest`,
            path.resolve(packageRoot, '../..'),
            log,
            undefined,
            live,
          );
        });
      } else if (hasGit) {
        doStep('git pull --ff-only', () => {
          run('git pull --ff-only', packageRoot, log, undefined, live);
        });
        gitInstallAndBuild(packageRoot, log, live, doStep);
      } else {
        doStep(`npm install -g ${NPM_PACKAGE}@latest`, () => {
          run(
            `npm install -g ${NPM_PACKAGE}@latest`,
            packageRoot,
            log,
            undefined,
            live,
          );
        });
      }

      // Ensure pm2 is available for Admin PM2 control page
      doStep('npm install -g pm2', () => {
        try {
          run('npm install -g pm2', packageRoot, log, undefined, live);
        } catch (e) {
          log.push(
            `pm2 install warn: ${e instanceof Error ? e.message : e} (optional)`,
          );
        }
      });

      // Auto migrate after package update (local prisma binary preferred)
      if (willMigrate) {
        const dbUrl =
          options?.databaseUrl ||
          process.env.DATABASE_URL ||
          `file:${path.join(packageRoot, 'data', 'gateway.db')}`;
        log.push(`migrate DATABASE_URL=${dbUrl}`);
        doStep('prisma generate + migrate deploy', () => {
          try {
            runPostUpdateMigrate(packageRoot, dbUrl, log, live);
          } catch (e) {
            log.push(`migrate warn: ${e instanceof Error ? e.message : e}`);
            // Retry once with npx if local prisma missing after global install
            run(
              `npx --yes prisma@${PRISMA_VERSION} generate`,
              packageRoot,
              log,
              { DATABASE_URL: dbUrl },
              live,
            );
            run(
              `npx --yes prisma@${PRISMA_VERSION} migrate deploy`,
              packageRoot,
              log,
              { DATABASE_URL: dbUrl },
              live,
            );
            log.push('Database migrations applied (npx fallback)');
          }
        });
      }

      let toVersion: string | null = null;
      try {
        // re-read package from disk after update (global path may change)
        toVersion = readLocalPackage().version;
      } catch {
        toVersion = null;
      }

      return {
        ok: true,
        channel,
        fromVersion,
        toVersion,
        log,
        restartRequired: true,
        message:
          'Update finished (code + DB migrate). Restart the gateway to load new code.',
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log.push(msg);
      // Code update failed — still try DB migrate so new tables land.
      try {
        const dbUrl =
          options?.databaseUrl ||
          process.env.DATABASE_URL ||
          `file:${path.join(packageRoot, 'data', 'gateway.db')}`;
        log.push('── update error: still running prisma migrate deploy ──');
        runPostUpdateMigrate(packageRoot, dbUrl, log, live);
      } catch (migrateErr) {
        log.push(
          `migrate after update error: ${
            migrateErr instanceof Error ? migrateErr.message : migrateErr
          }`,
        );
      }
      throw ExceptionFactory.internal(`Update failed: ${msg}`, { log });
    } finally {
      this.updating = false;
    }
  }

  /**
   * Run update then restart detached process (used by admin one-click).
   * Spawns a short-lived shell so the HTTP response can return first.
   */
  scheduleUpdateAndRestart(options?: {
    home?: string;
    port?: number;
  }): { scheduled: true; message: string } {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      throw ExceptionFactory.validation(
        'Refusing scheduled update/restart while NODE_ENV=test / VITEST',
      );
    }
    if (this.updating) {
      throw ExceptionFactory.validation('Update already in progress');
    }

    const packageRoot = getPackageRoot();
    const cli = path.join(packageRoot, 'dist', 'cli', 'index.js');
    const home = options?.home || process.env.GCTOAC_HOME || '';
    const port = options?.port || Number(process.env.PORT || 3847);

    const homeFlag = home ? ` --home ${JSON.stringify(home)}` : '';
    const portFlag = port ? ` --port ${port}` : '';

    // Delay so HTTP can flush; then update + restart via CLI
    const script = [
      'sleep 2',
      `node ${JSON.stringify(cli)} update${homeFlag} || true`,
      `node ${JSON.stringify(cli)} migrate${homeFlag} || true`,
      `node ${JSON.stringify(cli)} restart${homeFlag}${portFlag} || true`,
    ].join(' && ');

    const child = spawn('bash', ['-lc', script], {
      detached: true,
      stdio: 'ignore',
      env: process.env,
      cwd: packageRoot,
    });
    child.unref();

    return {
      scheduled: true,
      message:
        'Update scheduled. The server will update and restart in a few seconds. Refresh Admin after ~30s.',
    };
  }
}

export const updateService = new UpdateService();
