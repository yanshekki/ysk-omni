import { env } from '../config/env';

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

/**
 * Grok inspect spawn is removed. Admin still calls snapshot(); it reports
 * that no CLI is attached.
 */
export class GrokInspectService {
  async snapshot(): Promise<GrokInspectSnapshot> {
    return {
      ok: false,
      grokVersion: null,
      channel: null,
      cwd: null,
      projectRoot: null,
      defaultModel: env.GROK_DEFAULT_MODEL || null,
      models: [],
      skills: 0,
      mcpServers: 0,
      plugins: 0,
      hooks: 0,
      error: 'Grok CLI spawn removed; text chat uses llama-server / vLLM / echo',
    };
  }
}

export const grokInspectService = new GrokInspectService();
