import { spawn } from 'node:child_process';
import path from 'node:path';
import { updateService } from '../../services/update.service';
import { fail, info, ok, warn } from '../lib/print';
import { ensureHomeDirs, resolveRuntimePaths } from '../lib/paths';
import { ensureEnvFile, loadEnvIntoProcess } from '../lib/env-file';
import { tryAutoMigrate } from '../lib/auto-migrate';
import { Spinner, stepBanner } from '../lib/spinner';

/**
 * Always hard-exit. undici fetch keep-alive + any leftover handles can leave
 * the CLI stuck until Ctrl+C even after printing "done".
 */
function exitCli(code = 0): never {
  try {
    process.stdout.write('');
    process.stderr.write('');
  } catch {
    /* ignore */
  }
   
  process.exit(code);
}

function applyMigrations(
  packageRoot: string,
  databaseUrl: string,
  spinner: Spinner,
): boolean {
  spinner.start('gctoac migrate (prisma deploy)…');
  const result = tryAutoMigrate({ packageRoot, databaseUrl });
  if (result.ok) {
    spinner.succeed('gctoac migrate');
    ok('Database migrations applied');
    return true;
  }
  spinner.fail(`gctoac migrate: ${result.error || 'failed'}`);
  return false;
}

/**
 * Restart in a fully detached child so this process can exit immediately.
 */
function spawnRestartDetached(opts: {
  packageRoot: string;
  home: string;
  port?: number;
}): void {
  const cli = path.join(opts.packageRoot, 'dist', 'cli', 'index.js');
  const args = [cli, 'restart', '--home', opts.home];
  if (opts.port != null && Number.isFinite(opts.port)) {
    args.push('--port', String(opts.port));
  }
  const child = spawn(process.execPath, args, {
    detached: true,
    stdio: 'ignore',
    env: process.env,
    cwd: opts.packageRoot,
  });
  child.unref();
}

export async function cmdUpdate(opts: {
  home?: string;
  port?: number;
  forceHome?: boolean;
  check?: boolean;
  restart?: boolean;
  channel?: 'auto' | 'git' | 'npm-global' | 'npm-local';
}): Promise<void> {
  let code = 0;
  const spinner = new Spinner();
  try {
    const paths = resolveRuntimePaths({
      home: opts.home,
      forceHome: opts.forceHome ?? Boolean(opts.home),
    });
    ensureHomeDirs(paths);
    const envFile = ensureEnvFile(paths);
    loadEnvIntoProcess(paths.envFile);
    const databaseUrl = envFile.DATABASE_URL || paths.databaseUrl;

    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║     gctoac update — Grok Gateway CLI     ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log('');

    spinner.start('Checking npm / GitHub for updates…');
    const infoVer = await updateService.getVersionInfo();
    spinner.succeed('Version check complete');

    info(`Current:  ${infoVer.current}`);
    info(`Channel:  ${infoVer.channel} (${infoVer.installSource})`);
    info(`npm:      ${infoVer.latestNpm ?? 'n/a'}`);
    info(`GitHub:   ${infoVer.latestGithub ?? 'n/a'}`);
    info(`Latest:   ${infoVer.latest ?? 'n/a'}`);
    info(
      `Status:   ${infoVer.versionStatus}${infoVer.updateAvailable ? ' (update available)' : ''}`,
    );
    info(`Data DB:  ${databaseUrl}`);

    if (opts.check) {
      if (infoVer.updateAvailable) {
        info('⚠ Update available — run: gctoac update');
      } else {
        ok('Already up to date (or no newer npm/GitHub release found)');
      }
      exitCli(0);
    }

    if (!infoVer.updateAvailable && infoVer.channel !== 'git') {
      warn('No newer version detected; running update anyway…');
    }

    info('');
    info('Starting update (live progress below)…');

    // Live mode: stream git/npm/prisma to the terminal so progress is visible.
    // Spinner only for short waits (version check / final migrate / restart).
    const result = await updateService.performUpdate({
      channel: opts.channel || 'auto',
      databaseUrl,
      skipMigrate: false,
      live: true,
      progress: {
        step: ({ index, total, title }) => {
          spinner.stopSilent();
          stepBanner(index, total, title);
        },
        start: (label) => {
          spinner.stopSilent();
          info(`→ ${label}`);
          info('  (live output — please wait…)\n');
        },
        succeed: (label) => {
          ok(`Step done: ${label}`);
        },
        fail: (label) => {
          fail(`Step failed: ${label}`);
        },
      },
    });

    ok(result.message);
    info(`Version: ${result.fromVersion} → ${result.toVersion ?? '?'}`);

    info('');
    info('── Final DB migrate (data home) ──');
    if (!applyMigrations(paths.packageRoot, databaseUrl, spinner)) {
      warn('Retry: gctoac migrate');
      code = 1;
    }

    if (opts.restart !== false && result.restartRequired) {
      spinner.start('Scheduling gateway restart…');
      try {
        spawnRestartDetached({
          packageRoot: paths.packageRoot,
          home: paths.home,
          port: opts.port,
        });
        spinner.succeed('Restart scheduled (gctoac restart)');
      } catch (e) {
        spinner.fail(
          `Restart spawn failed: ${e instanceof Error ? e.message : String(e)}`,
        );
        warn('Run: gctoac restart');
        code = code || 1;
      }
    } else if (result.restartRequired) {
      warn('Restart required: gctoac restart');
    }

    console.log('');
    ok('Update complete. Done.');
    console.log('');
  } catch (e) {
    spinner.stopSilent();
    fail(e instanceof Error ? e.message : String(e));
    code = 1;
    // Update failed (git/npm/build) — still apply pending Prisma migrations.
    try {
      const paths = resolveRuntimePaths({
        home: opts.home,
        forceHome: opts.forceHome ?? Boolean(opts.home),
      });
      const envFile = ensureEnvFile(paths);
      loadEnvIntoProcess(paths.envFile);
      const databaseUrl = envFile.DATABASE_URL || paths.databaseUrl;
      info('');
      info('── Update errored; still running gctoac migrate ──');
      if (!applyMigrations(paths.packageRoot, databaseUrl, spinner)) {
        warn('Retry: gctoac migrate');
      }
    } catch (migrateErr) {
      warn(
        `Auto-migrate after update error failed: ${
          migrateErr instanceof Error ? migrateErr.message : String(migrateErr)
        }`,
      );
    }
  } finally {
    spinner.stopSilent();
    exitCli(code);
  }
}
