import type {
  EngineJsonResult,
  EngineRunOptions,
  EngineRunResult,
  EngineStreamEvent,
} from '../interfaces';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { env } from '../config/env';

/** In-flight chat job slot (global concurrency). */
export class EngineSlotService {
  private active = 0;

  get activeCount(): number {
    return this.active;
  }

  get maxConcurrent(): number {
    return env.OMNI_MAX_CONCURRENT;
  }

  tryAcquire(): boolean {
    if (this.active >= env.OMNI_MAX_CONCURRENT) {
      return false;
    }
    this.active += 1;
    return true;
  }

  release(): void {
    this.active = Math.max(0, this.active - 1);
  }

  buildArgs(_options: EngineRunOptions & { promptFile?: string }): string[] {
    throw ExceptionFactory.engineUnconfigured();
  }

  async runOnce(_options: EngineRunOptions): Promise<EngineRunResult> {
    throw ExceptionFactory.engineUnconfigured();
  }

  async *stream(
    _options: EngineRunOptions,
  ): AsyncGenerator<EngineStreamEvent, void, unknown> {
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

  parseJsonResult(_stdout: string): EngineJsonResult {
    return { text: '' };
  }

  sanitizedEnv(): NodeJS.ProcessEnv {
    return {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
    };
  }
}

export const engineSlotService = new EngineSlotService();
