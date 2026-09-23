import execa from 'execa';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { grokCliService } from './grok-cli.service';

export type GrokInspectSnapshot = {
  ok: boolean;
  grokVersion: string | null;
  channel: string | null;
  cwd: string | null;
  projectRoot: string | null;
  defaultModel: string | null;
  models: string[];
  skills: number;
  mcpServers: number;
  plugins: number;
  hooks: number;
  error?: string;
};

function countList(v: unknown): number {
  return Array.isArray(v) ? v.length : 0;
}

/**
 * Read-only snapshot of the local Grok Build environment.
 * Wraps `grok inspect --json` + `grok models` — does not edit config.
 */
export class GrokInspectService {
  async snapshot(): Promise<GrokInspectSnapshot> {
    const base: GrokInspectSnapshot = {
      ok: false,
      grokVersion: null,
      channel: null,
      cwd: null,
      projectRoot: null,
      defaultModel: env.GROK_DEFAULT_MODEL,
      models: [],
      skills: 0,
      mcpServers: 0,
      plugins: 0,
      hooks: 0,
    };

    try {
      const [inspect, models] = await Promise.all([
        execa(env.GROK_BIN, ['inspect', '--json'], {
          timeout: 15_000,
          reject: false,
          env: process.env,
        }),
        grokCliService.listModelsFromCli(),
      ]);

      base.models = models;
      if (inspect.exitCode !== 0) {
        base.error = (inspect.stderr || inspect.stdout || 'inspect failed').slice(
          0,
          500,
        );
        return base;
      }

      let parsed: Record<string, unknown> = {};
      try {
        parsed = JSON.parse(inspect.stdout || '{}') as Record<string, unknown>;
      } catch {
        base.error = 'grok inspect --json produced invalid JSON';
        return base;
      }

      base.ok = true;
      base.grokVersion =
        typeof parsed.grokVersion === 'string' ? parsed.grokVersion : null;
      base.channel = typeof parsed.channel === 'string' ? parsed.channel : null;
      base.cwd = typeof parsed.cwd === 'string' ? parsed.cwd : null;
      base.projectRoot =
        typeof parsed.projectRoot === 'string' ? parsed.projectRoot : null;
      base.skills = countList(parsed.skills);
      base.mcpServers = countList(parsed.mcpServers);
      base.plugins = countList(parsed.plugins);
      base.hooks = countList(parsed.hooks);
      return base;
    } catch (err) {
      logger.warn({ err }, 'grok inspect snapshot failed');
      base.error = err instanceof Error ? err.message : 'inspect failed';
      return base;
    }
  }
}

export const grokInspectService = new GrokInspectService();
