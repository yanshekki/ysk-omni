import { resolveRuntimePaths } from '../lib/paths';
import { ensureEnvFile, loadEnvIntoProcess } from '../lib/env-file';
import { runPrisma } from '../lib/run-prisma';
import { ok } from '../lib/print';

export async function cmdMigrate(opts: {
  home?: string;
  forceHome?: boolean;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);

  runPrisma(['migrate', 'deploy'], {
    cwd: paths.packageRoot,
    packageRoot: paths.packageRoot,
    env: {
      ...process.env,
      DATABASE_URL: env.DATABASE_URL || paths.databaseUrl,
    },
  });
  ok('Migrate complete');
}
