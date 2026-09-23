import { resolveRuntimePaths } from '../lib/paths';
import { ensureEnvFile, loadEnvIntoProcess } from '../lib/env-file';
import { seedAdmin } from '../lib/seed-admin';
import { ok } from '../lib/print';

export async function cmdSeed(opts: {
  home?: string;
  forceHome?: boolean;
}): Promise<void> {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);

  await seedAdmin({
    databaseUrl: env.DATABASE_URL || paths.databaseUrl,
    bootstrapKey: env.ADMIN_BOOTSTRAP_KEY,
    port: env.PORT,
  });
  ok('Seed complete');
}
