import type {
  GrokJsonResult,
  GrokRunOptions,
  GrokRunResult,
  GrokStreamEvent,
} from '../interfaces';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { env } from '../config/env';

/**
 * Grok CLI spawn is removed. Callers still go through this service so chat,
 * media, and health keep compiling until local engines attach (Phase 1+).
 */
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

  buildArgs(_options: GrokRunOptions & { promptFile?: string }): string[] {
    throw ExceptionFactory.engineUnconfigured();
  }

  async runOnce(_options: GrokRunOptions): Promise<GrokRunResult> {
    throw ExceptionFactory.engineUnconfigured();
  }

  async *stream(
    _options: GrokRunOptions,
  ): AsyncGenerator<GrokStreamEvent, void, unknown> {
    throw ExceptionFactory.engineUnconfigured();
  }

  async isAvailable(): Promise<boolean> {
    return false;
  }

  async listModelsFromCli(): Promise<string[]> {
    return [];
  }

  parseModelsOutput(_stdout: string): string[] {
    return [];
  }

  parseJsonResult(_stdout: string): GrokJsonResult {
    return { text: '' };
  }

  sanitizedEnv(): NodeJS.ProcessEnv {
    return {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
    };
  }
}

export const grokCliService = new GrokCliService();
