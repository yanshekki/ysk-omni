import { PrismaClient } from '@prisma/client';
import {
  DEFAULT_PORT,
  resolveRuntimePaths,
  type RuntimePaths,
} from './paths';
import { ensureEnvFile, loadEnvIntoProcess } from './env-file';

export type CliOpts = {
  home?: string;
  forceHome?: boolean;
  port?: number;
  json?: boolean;
};

export type CliRuntime = {
  paths: RuntimePaths;
  env: Record<string, string>;
  databaseUrl: string;
  port: number;
  json: boolean;
};

/** Resolve data home, load .env, point DATABASE_URL at the gateway DB. */
export function initCliRuntime(opts: CliOpts = {}): CliRuntime {
  const paths = resolveRuntimePaths({
    home: opts.home,
    forceHome: opts.forceHome ?? Boolean(opts.home),
  });
  const env = ensureEnvFile(paths);
  loadEnvIntoProcess(paths.envFile);
  const databaseUrl = env.DATABASE_URL || paths.databaseUrl;
  process.env.DATABASE_URL = databaseUrl;
  const port = Number(opts.port || env.PORT || DEFAULT_PORT) || DEFAULT_PORT;
  return {
    paths,
    env,
    databaseUrl,
    port,
    json: Boolean(opts.json),
  };
}

export function openPrisma(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });
}

/** Run work with a short-lived Prisma client (always disconnects). */
export async function withPrisma<T>(
  databaseUrl: string,
  fn: (prisma: PrismaClient) => Promise<T>,
): Promise<T> {
  const prisma = openPrisma(databaseUrl);
  try {
    return await fn(prisma);
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

export function parseOnOff(v: string | boolean | undefined): boolean | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v === 'boolean') return v;
  const s = String(v).trim().toLowerCase();
  if (['1', 'true', 'on', 'yes', 'y'].includes(s)) return true;
  if (['0', 'false', 'off', 'no', 'n'].includes(s)) return false;
  throw new Error(`Expected on/off (got: ${v})`);
}

export function emitJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}
