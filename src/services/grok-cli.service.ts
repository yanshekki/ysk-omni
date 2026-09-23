import { createInterface } from 'node:readline';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
// execa@5 is CJS-compatible (v8+ is ESM-only and breaks CommonJS dist/)
import execa from 'execa';
import { env } from '../config/env';
import type {
  GrokJsonResult,
  GrokRunOptions,
  GrokRunResult,
  GrokStreamEvent,
} from '../interfaces';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { logger } from '../utils/logger';
import { isSessionAlreadyExistsError, isUuid } from '../utils/grok-session';

/** Prompts longer than this always go via --prompt-file (avoid ARG_MAX). */
const PROMPT_FILE_THRESHOLD = 2_000;

export class GrokCliService {
  private active = 0;

  get activeCount(): number {
    return this.active;
  }

  get maxConcurrent(): number {
    return env.GROK_MAX_CONCURRENT;
  }

  tryAcquire(): boolean {
    if (this.active >= env.GROK_MAX_CONCURRENT) {
      return false;
    }
    this.active += 1;
    return true;
  }

  release(): void {
    this.active = Math.max(0, this.active - 1);
  }

  /**
   * Build CLI args. Prefer `--prompt-file` for large prompts to avoid ARG_MAX.
   * When `promptFile` is set, `-p` is omitted.
   */
  buildArgs(
    options: GrokRunOptions & { promptFile?: string },
  ): string[] {
    const args: string[] = [];

    // Resume / continue take precedence over fresh -p for session continuity.
    // Grok 1.0+: `-s` only *creates* a new UUID session (errors if it exists).
    if (options.continueSession) {
      args.push('--continue');
    } else if (options.resumeSessionId) {
      args.push('--resume', options.resumeSessionId);
    }

    if (options.forkSession) {
      args.push('--fork-session');
    }

    const canCreateNamedSession =
      Boolean(options.sessionId) &&
      (options.forkSession ||
        (!options.continueSession && !options.resumeSessionId));
    if (canCreateNamedSession && options.sessionId && isUuid(options.sessionId)) {
      args.push('-s', options.sessionId);
    }

    // Prompt sources: prompt-json > prompt-file > -p (only one)
    if (options.promptJson) {
      args.push('--prompt-json', options.promptJson);
    } else if (options.promptFile) {
      args.push('--prompt-file', options.promptFile);
    } else if (!options.continueSession && !options.resumeSessionId) {
      args.push('-p', options.prompt || '');
    } else if (options.prompt?.trim()) {
      // resume with extra prompt
      args.push('-p', options.prompt);
    }

    args.push(
      '-m',
      options.model,
      '--cwd',
      options.cwd,
      '--output-format',
      options.stream ? 'streaming-json' : 'json',
    );

    const alwaysApprove =
      options.alwaysApprove !== undefined
        ? options.alwaysApprove
        : env.GROK_ALWAYS_APPROVE;
    if (alwaysApprove) {
      args.push('--always-approve');
    }

    if (options.maxTurns != null && options.maxTurns > 0) {
      args.push('--max-turns', String(options.maxTurns));
    }

    if (options.toolsAllowlist) {
      args.push('--tools', options.toolsAllowlist);
    }

    if (options.toolsDenylist) {
      args.push('--disallowed-tools', options.toolsDenylist);
    }

    if (options.jsonSchema) {
      args.push('--json-schema', options.jsonSchema);
    }

    if (options.reasoningEffort) {
      args.push('--reasoning-effort', options.reasoningEffort);
    }

    if (options.systemPromptOverride) {
      args.push('--system-prompt-override', options.systemPromptOverride);
    }

    if (options.rules) {
      args.push('--rules', options.rules);
    }

    if (options.permissionMode) {
      args.push('--permission-mode', options.permissionMode);
    }

    if (options.sandbox) {
      args.push('--sandbox', options.sandbox);
    }

    if (options.allowRules?.length) {
      for (const rule of options.allowRules) {
        if (rule?.trim()) args.push('--allow', rule.trim());
      }
    }

    if (options.denyRules?.length) {
      for (const rule of options.denyRules) {
        if (rule?.trim()) args.push('--deny', rule.trim());
      }
    }

    if (options.disableWebSearch) {
      args.push('--disable-web-search');
    }

    if (options.noSubagents) {
      args.push('--no-subagents');
    }

    if (options.noPlan) {
      args.push('--no-plan');
    }

    if (options.noMemory) {
      args.push('--no-memory');
    }

    if (options.experimentalMemory) {
      args.push('--experimental-memory');
    }

    // --best-of-n / --check were removed in Grok Build 1.0+ (unexpected argument).

    if (options.verbatim) {
      args.push('--verbatim');
    }

    if (options.noAutoUpdate !== false) {
      args.push('--no-auto-update');
    }

    if (options.noAskUser !== false) {
      args.push('--no-ask-user');
    }

    if (options.agent) {
      args.push('--agent', options.agent);
    }

    if (options.agentsJson) {
      args.push('--agents', options.agentsJson);
    }

    return args;
  }

  /** Write prompt to a temp file when large (or forceFile). Caller must cleanup. */
  async preparePromptFile(
    prompt: string,
    forceFile = false,
  ): Promise<{ promptFile?: string; cleanup: () => Promise<void> }> {
    if (!forceFile && prompt.length <= PROMPT_FILE_THRESHOLD) {
      return { cleanup: async () => undefined };
    }
    const dir = path.join(env.storageDir, 'tmp', 'prompts');
    await fs.mkdir(dir, { recursive: true });
    const promptFile = path.join(dir, `prompt-${randomUUID()}.txt`);
    await fs.writeFile(promptFile, prompt, { mode: 0o600, encoding: 'utf8' });
    return {
      promptFile,
      cleanup: async () => {
        await fs.unlink(promptFile).catch(() => undefined);
      },
    };
  }

  private withResumeInsteadOfCreate(options: GrokRunOptions): GrokRunOptions {
    const id = options.sessionId;
    return {
      ...options,
      resumeSessionId: id || options.resumeSessionId,
      sessionId: undefined,
    };
  }

  async runOnce(options: GrokRunOptions): Promise<GrokRunResult> {
    try {
      return await this.runOnceAttempt(options);
    } catch (err) {
      if (
        options.sessionId &&
        !options.resumeSessionId &&
        isSessionAlreadyExistsError(err)
      ) {
        logger.warn(
          { sessionId: options.sessionId },
          'Grok session already exists; retrying with --resume',
        );
        return this.runOnceAttempt(this.withResumeInsteadOfCreate(options));
      }
      throw err;
    }
  }

  private async runOnceAttempt(options: GrokRunOptions): Promise<GrokRunResult> {
    const { promptFile, cleanup } = await this.preparePromptFile(options.prompt);
    const args = this.buildArgs({ ...options, stream: false, promptFile });
    const timeout = options.timeoutMs ?? env.GROK_TIMEOUT_MS;

    logger.debug(
      {
        bin: env.GROK_BIN,
        model: options.model,
        cwd: options.cwd,
        promptChars: options.prompt.length,
        promptFile: promptFile ? true : false,
        alwaysApprove: options.alwaysApprove,
        maxTurns: options.maxTurns,
        toolsAllowlist: options.toolsAllowlist,
        toolsDenylist: options.toolsDenylist ? '[set]' : null,
      },
      'Spawning grok',
    );

    try {
      const result = await execa(env.GROK_BIN, args, {
        timeout,
        reject: false,
        cwd: await this.ensureRunCwd(options.cwd),
        env: this.sanitizedEnv(),
        maxBuffer: 20 * 1024 * 1024,
      });

      if (result.timedOut) {
        throw ExceptionFactory.grokTimeout();
      }

      if (result.exitCode !== 0) {
        const stderr = (result.stderr || '').slice(0, 2000);
        logger.error({ exitCode: result.exitCode, stderr }, 'Grok CLI failed');
        throw ExceptionFactory.grokError(
          `Grok CLI exited with code ${result.exitCode}`,
          { stderr },
        );
      }

      const raw = this.parseJsonResult(result.stdout || '');
      return {
        text: raw.text ?? '',
        stopReason: raw.stopReason,
        sessionId: raw.sessionId,
        raw,
      };
    } catch (err) {
      if (err instanceof Error && 'code' in err && (err as { code?: string }).code === 'ENOENT') {
        throw ExceptionFactory.grokNotAvailable(
          `Grok binary not found: ${env.GROK_BIN}. Install Grok CLI and ensure it is on PATH.`,
        );
      }
      throw err;
    } finally {
      await cleanup();
    }
  }

  async *stream(
    options: GrokRunOptions,
  ): AsyncGenerator<GrokStreamEvent, void, unknown> {
    try {
      yield* this.streamAttempt(options);
    } catch (err) {
      if (
        options.sessionId &&
        !options.resumeSessionId &&
        isSessionAlreadyExistsError(err)
      ) {
        logger.warn(
          { sessionId: options.sessionId },
          'Grok session already exists; retrying stream with --resume',
        );
        yield* this.streamAttempt(this.withResumeInsteadOfCreate(options));
        return;
      }
      throw err;
    }
  }

  private async *streamAttempt(
    options: GrokRunOptions,
  ): AsyncGenerator<GrokStreamEvent, void, unknown> {
    // Always use prompt-file for stream to avoid ARG_MAX and shell limits
    const { promptFile, cleanup } = await this.preparePromptFile(
      options.prompt,
      true,
    );
    const args = this.buildArgs({ ...options, stream: true, promptFile });
    const timeout = options.timeoutMs ?? env.GROK_TIMEOUT_MS;

    const proc = execa(env.GROK_BIN, args, {
      timeout,
      reject: false,
      cwd: await this.ensureRunCwd(options.cwd),
      env: this.sanitizedEnv(),
      buffer: false,
    });

    if (!proc.stdout) {
      await cleanup();
      throw ExceptionFactory.grokError('Grok CLI produced no stdout');
    }

    const rl = createInterface({ input: proc.stdout });
    try {
      for await (const line of rl) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const event = JSON.parse(trimmed) as GrokStreamEvent;
          yield event;
        } catch {
          logger.warn({ line: trimmed.slice(0, 200) }, 'Skipping non-JSON grok stream line');
        }
      }

      const result = await proc;
      if (result.timedOut) {
        throw ExceptionFactory.grokTimeout();
      }
      if (result.exitCode !== 0 && result.exitCode !== null) {
        const stderr = (result.stderr || '').toString().slice(0, 2000);
        throw ExceptionFactory.grokError(
          `Grok CLI exited with code ${result.exitCode}`,
          { stderr },
        );
      }
    } finally {
      rl.close();
      try {
        proc.kill('SIGTERM');
      } catch {
        /* ignore */
      }
      await cleanup();
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const result = await execa(env.GROK_BIN, ['--version'], {
        timeout: 10_000,
        reject: false,
      });
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }

  async listModelsFromCli(): Promise<string[]> {
    try {
      const result = await execa(env.GROK_BIN, ['models'], {
        timeout: 30_000,
        reject: false,
        env: this.sanitizedEnv(),
      });
      if (result.exitCode !== 0) {
        return [];
      }
      return this.parseModelsOutput(result.stdout || '');
    } catch {
      return [];
    }
  }

  parseModelsOutput(stdout: string): string[] {
    const models: string[] = [];
    for (const line of stdout.split('\n')) {
      const match = line.match(/^\s*[*+-]\s+([a-zA-Z0-9._-]+)/);
      if (match?.[1]) {
        models.push(match[1]);
      }
    }
    return [...new Set(models)];
  }

  parseJsonResult(stdout: string): GrokJsonResult {
    const trimmed = stdout.trim();
    if (!trimmed) {
      return { text: '' };
    }

    // Prefer last JSON object if CLI prints extra lines
    const lines = trimmed.split('\n').filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      try {
        return JSON.parse(lines[i]!) as GrokJsonResult;
      } catch {
        /* try previous */
      }
    }

    try {
      return JSON.parse(trimmed) as GrokJsonResult;
    } catch {
      // Fallback: treat entire stdout as plain text
      return { text: trimmed };
    }
  }

  private async ensureRunCwd(cwd?: string): Promise<string> {
    const dir = cwd?.trim() || env.defaultCwd;
    await fs.mkdir(dir, { recursive: true });
    return dir;
  }

  sanitizedEnv(): NodeJS.ProcessEnv {
    const allow = new Set([
      'PATH',
      'HOME',
      'USER',
      'LOGNAME',
      'SHELL',
      'LANG',
      'LC_ALL',
      'LC_CTYPE',
      'TERM',
      'TMPDIR',
      'TMP',
      'TEMP',
      'TZ',
      'GROK_HOME',
      'GROK_BIN',
      'XDG_CONFIG_HOME',
      'XDG_CACHE_HOME',
      'XDG_DATA_HOME',
    ]);
    const out: NodeJS.ProcessEnv = {};
    for (const [k, v] of Object.entries(process.env)) {
      if (v == null) continue;
      if (allow.has(k) || k.startsWith('GROK_') || k.startsWith('XAI_')) {
        if (k === 'ENCRYPTION_KEY' || k === 'DATABASE_URL' || k === 'ADMIN_BOOTSTRAP_KEY') {
          continue;
        }
        out[k] = v;
      }
    }
    return out;
  }
}

export const grokCliService = new GrokCliService();
