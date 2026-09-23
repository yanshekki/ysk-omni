import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const PACKAGE_NAME = 'grok-cli-to-openai-compatible';
export const DEFAULT_PORT = 3847;

/** Installed package root (contains package.json, prisma/, dist/) */
export function getPackageRoot(): string {
  // dist/cli/lib -> dist/cli -> dist -> package root
  return path.resolve(__dirname, '../../..');
}

export function getDefaultHome(): string {
  if (process.env.GCTOAC_HOME?.trim()) {
    return path.resolve(process.env.GCTOAC_HOME.trim());
  }
  return path.join(os.homedir(), '.gctoac');
}

export interface RuntimePaths {
  mode: 'home' | 'project';
  home: string;
  packageRoot: string;
  envFile: string;
  dataDir: string;
  storageDir: string;
  logsDir: string;
  pidFile: string;
  databaseUrl: string;
}

/**
 * Prefer project-local data when running inside this repo checkout.
 * Otherwise use ~/.gctoac (or GCTOAC_HOME / --home).
 */
export function resolveRuntimePaths(options?: {
  home?: string;
  forceHome?: boolean;
}): RuntimePaths {
  const packageRoot = getPackageRoot();
  const cwd = process.cwd();

  let mode: 'home' | 'project' = 'home';
  let home = options?.home
    ? path.resolve(options.home)
    : getDefaultHome();

  if (!options?.forceHome && !options?.home && isProjectCheckout(cwd)) {
    mode = 'project';
    home = cwd;
  } else if (options?.forceHome || options?.home || process.env.GCTOAC_HOME) {
    mode = 'home';
  } else if (isProjectCheckout(cwd)) {
    mode = 'project';
    home = cwd;
  }

  const dataDir = path.join(home, 'data');
  const storageDir = path.join(home, 'storage');
  const logsDir = path.join(home, 'logs');
  const envFile = path.join(home, '.env');
  const pidFile = path.join(home, 'gctoac.pid');
  // Absolute file URL is reliable for global install (not relative to prisma/)
  const dbFile = path.resolve(dataDir, 'gateway.db');
  const databaseUrl = `file:${dbFile}`;

  return {
    mode,
    home,
    packageRoot,
    envFile,
    dataDir,
    storageDir,
    logsDir,
    pidFile,
    databaseUrl,
  };
}

export function isProjectCheckout(dir: string): boolean {
  try {
    const pkgPath = path.join(dir, 'package.json');
    if (!fs.existsSync(pkgPath)) return false;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { name?: string };
    if (pkg.name !== PACKAGE_NAME) return false;
    return fs.existsSync(path.join(dir, 'prisma', 'schema.prisma'));
  } catch {
    return false;
  }
}

export function ensureHomeDirs(paths: RuntimePaths): void {
  fs.mkdirSync(paths.dataDir, { recursive: true });
  fs.mkdirSync(paths.storageDir, { recursive: true });
  fs.mkdirSync(paths.logsDir, { recursive: true });
  fs.mkdirSync(path.join(paths.storageDir, 'sandboxes'), { recursive: true });
}
