import { runPrisma } from './run-prisma';

export type AutoMigrateResult = {
  ok: boolean;
  error?: string;
};

/**
 * Best-effort prisma generate + migrate deploy.
 * Never throws — callers always continue (update error / start / restart).
 */
export function tryAutoMigrate(opts: {
  packageRoot: string;
  databaseUrl: string;
  cwd?: string;
}): AutoMigrateResult {
  const env = {
    ...process.env,
    DATABASE_URL: opts.databaseUrl,
  };
  const runOpts = {
    cwd: opts.cwd || opts.packageRoot,
    packageRoot: opts.packageRoot,
    env,
  };

  try {
    runPrisma(['generate'], runOpts);
  } catch {
    /* generate can fail on older trees; deploy is what matters */
  }

  try {
    runPrisma(['migrate', 'deploy'], runOpts);
    return { ok: true };
  } catch (first) {
    try {
      runPrisma(['migrate', 'deploy'], runOpts);
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: first instanceof Error ? first.message : String(first),
      };
    }
  }
}
