import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

/** Keep in sync with package.json prisma / @prisma/client version */
export const PRISMA_VERSION = '6.5.0';

const requireFromHere = createRequire(__filename);

function prismaEntryFromRoot(root: string): string | null {
  const direct = path.join(root, 'node_modules', 'prisma', 'build', 'index.js');
  if (fs.existsSync(direct)) return direct;
  try {
    const req = createRequire(path.join(root, 'package.json'));
    const pkgJson = req.resolve('prisma/package.json');
    const entry = path.join(path.dirname(pkgJson), 'build', 'index.js');
    if (fs.existsSync(entry)) return entry;
  } catch {
    /* not installed under this root */
  }
  return null;
}

/**
 * Resolve the prisma CLI entry (node script), preferring local installs over npx.
 * Order: packageRoot → cwd → require from this CLI package → null (caller may fall back).
 */
export function resolvePrismaEntry(packageRoot: string, cwd = process.cwd()): string | null {
  for (const root of [packageRoot, cwd]) {
    const entry = prismaEntryFromRoot(root);
    if (entry) return entry;
  }
  try {
    const pkgJson = requireFromHere.resolve('prisma/package.json');
    const entry = path.join(path.dirname(pkgJson), 'build', 'index.js');
    if (fs.existsSync(entry)) return entry;
  } catch {
    /* prisma not a dependency of the running CLI */
  }
  return null;
}

function which(cmd: string): string | null {
  const paths = (process.env.PATH || '').split(path.delimiter);
  const exts = process.platform === 'win32' ? ['.cmd', '.exe', '.bat', ''] : [''];
  for (const dir of paths) {
    for (const ext of exts) {
      const p = path.join(dir, cmd + ext);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

export function runPrisma(
  args: string[],
  options: {
    cwd: string;
    packageRoot: string;
    env?: NodeJS.ProcessEnv;
  },
): void {
  const env = { ...process.env, ...options.env };
  const entry = resolvePrismaEntry(options.packageRoot, options.cwd);

  if (entry) {
    execFileSync(process.execPath, [entry, ...args], {
      cwd: options.cwd,
      stdio: 'inherit',
      env,
    });
    return;
  }

  // Fallbacks when prisma is not installed locally (older global installs)
  const npmBin = which('npm');
  if (npmBin) {
    try {
      execFileSync(
        npmBin,
        ['exec', '--yes', `--package=prisma@${PRISMA_VERSION}`, '--', 'prisma', ...args],
        { cwd: options.cwd, stdio: 'inherit', env },
      );
      return;
    } catch {
      /* try npx next */
    }
  }

  const npxBin = which('npx');
  if (npxBin) {
    execFileSync(npxBin, ['--yes', `prisma@${PRISMA_VERSION}`, ...args], {
      cwd: options.cwd,
      stdio: 'inherit',
      env,
    });
    return;
  }

  throw new Error(
    `Prisma CLI not found. Reinstall: npm install -g grok-cli-to-openai-compatible\n` +
      `Or in this project: npm install && npx prisma@${PRISMA_VERSION} ${args.join(' ')}`,
  );
}
