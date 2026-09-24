import fs from 'node:fs';
import type { ChildProcess } from 'node:child_process';
import { findEntry, type RegistryEntry } from '../hf/registry';
import { ExceptionFactory } from '../../exceptions/exception.factory';
import { vramScheduler } from '../vram-scheduler';
import {
  llamaServerBin,
  proxyLlamaJson,
  proxyLlamaStream,
  spawnLlamaServer,
} from './llama-server';
import type { OpenAiChatCompletion } from '../../interfaces/open-ai-chat-completion.interface';

export type LoadedEngine = {
  id: string;
  kind: 'llamacpp';
  port: number;
  modelPath: string;
  vramMb: number;
  child: ChildProcess;
};

export class EngineManager {
  private engines = new Map<string, LoadedEngine>();

  list(): Array<Omit<LoadedEngine, 'child'>> {
    return [...this.engines.values()].map(({ child: _c, ...rest }) => rest);
  }

  get(id: string): LoadedEngine | undefined {
    return (
      this.engines.get(id) ||
      [...this.engines.values()].find((e) => e.id === id || e.id.startsWith(`${id}:`))
    );
  }

  async unload(id: string): Promise<boolean> {
    const eng = this.get(id);
    if (!eng) {
      vramScheduler.unload(id);
      return false;
    }
    try {
      eng.child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
    this.engines.delete(eng.id);
    vramScheduler.unload(eng.id);
    return true;
  }

  async unloadAll(): Promise<string[]> {
    const ids = [...this.engines.keys()];
    for (const id of ids) {
      await this.unload(id);
    }
    return ids;
  }

  async loadGguf(entry: RegistryEntry): Promise<LoadedEngine> {
    const existing = this.engines.get(entry.id);
    if (existing) return existing;
    if (!llamaServerBin()) {
      throw ExceptionFactory.engineUnconfigured(
        `llama-server is not on PATH; install llama.cpp and retry load of ${entry.id}`,
      );
    }
    if (!entry.path || !fs.existsSync(entry.path)) {
      throw ExceptionFactory.engineUnconfigured(
        `GGUF file missing for ${entry.id}; pull the model first`,
      );
    }
    const plan = vramScheduler.load({
      id: entry.id,
      vramMb: entry.vramMb || 4096,
    });
    if (!plan.accept) {
      throw ExceptionFactory.validation(
        `model ${entry.id} needs ${entry.vramMb} MB and does not fit VRAM budget`,
      );
    }
    for (const id of plan.unload) {
      if (id !== entry.id) await this.unload(id);
    }
    const spawned = await spawnLlamaServer(entry.path);
    const eng: LoadedEngine = {
      id: entry.id,
      kind: 'llamacpp',
      port: spawned.port,
      modelPath: entry.path,
      vramMb: entry.vramMb || 4096,
      child: spawned.child,
    };
    this.engines.set(entry.id, eng);
    return eng;
  }

  async ensureLlama(model: string): Promise<LoadedEngine> {
    const loaded = this.get(model);
    if (loaded) return loaded;
    const entry = findEntry(model);
    if (!entry) {
      throw ExceptionFactory.engineUnconfigured(
        `unknown model ${model}; pull a GGUF or use model=echo`,
      );
    }
    return this.loadGguf(entry);
  }

  async chatJson(
    model: string,
    messages: Array<{ role?: string; content?: unknown }>,
  ): Promise<OpenAiChatCompletion> {
    const eng = await this.ensureLlama(model);
    return proxyLlamaJson(eng.port, { model, messages });
  }

  async chatStream(
    model: string,
    messages: Array<{ role?: string; content?: unknown }>,
  ): Promise<Response> {
    const eng = await this.ensureLlama(model);
    return proxyLlamaStream(eng.port, { model, messages });
  }
}

export const engineManager = new EngineManager();
