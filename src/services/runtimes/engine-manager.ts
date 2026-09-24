import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
import { spawnVllmServe, vllmAvailable } from './vllm';
import type { OpenAiChatCompletion } from '../../interfaces/open-ai-chat-completion.interface';

export type LoadedEngine = {
  id: string;
  kind: 'llamacpp' | 'vllm';
  port: number;
  modelPath: string;
  vramMb: number;
  child: ChildProcess;
};

export type EngineStateRow = {
  id: string;
  kind: 'llamacpp' | 'vllm';
  port: number;
  modelPath: string;
  vramMb: number;
  pid: number | null;
};

export function enginesStatePath(): string {
  const home = process.env.OMNI_HOME?.trim()
    ? path.resolve(process.env.OMNI_HOME.trim())
    : path.join(os.homedir(), '.ysk-omni');
  return path.join(home, 'engines.json');
}

function pidAlive(pid: number | null | undefined): boolean {
  if (!pid || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function readEnginesState(): {
  loaded: EngineStateRow[];
  usedMb: number;
  budgetMb: number;
} {
  try {
    const raw = JSON.parse(fs.readFileSync(enginesStatePath(), 'utf8')) as {
      loaded?: EngineStateRow[];
      usedMb?: number;
      budgetMb?: number;
    };
    const loaded = (raw.loaded || []).filter((e) => pidAlive(e.pid));
    return {
      loaded,
      usedMb: loaded.reduce((s, e) => s + (e.vramMb || 0), 0),
      budgetMb: raw.budgetMb || 24_000,
    };
  } catch {
    return { loaded: [], usedMb: 0, budgetMb: 24_000 };
  }
}

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
      this.persist();
      return false;
    }
    try {
      eng.child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
    this.engines.delete(eng.id);
    vramScheduler.unload(eng.id);
    this.persist();
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
    this.persist();
    return eng;
  }

  async loadVllm(entry: RegistryEntry): Promise<LoadedEngine> {
    const existing = this.engines.get(entry.id);
    if (existing) return existing;
    if (!vllmAvailable()) {
      throw ExceptionFactory.engineUnconfigured(
        `vllm is not on PATH (no vllm CLI and no python -m vllm.entrypoints.openai.api_server); install vLLM and retry load of ${entry.id}`,
      );
    }
    const plan = vramScheduler.load({
      id: entry.id,
      vramMb: entry.vramMb || 16_000,
    });
    if (!plan.accept) {
      throw ExceptionFactory.validation(
        `model ${entry.id} needs ${entry.vramMb} MB and does not fit VRAM budget`,
      );
    }
    for (const id of plan.unload) {
      if (id !== entry.id) await this.unload(id);
    }
    const spawned = await spawnVllmServe(entry.repoId);
    const eng: LoadedEngine = {
      id: entry.id,
      kind: 'vllm',
      port: spawned.port,
      modelPath: entry.repoId,
      vramMb: entry.vramMb || 16_000,
      child: spawned.child,
    };
    this.engines.set(entry.id, eng);
    this.persist();
    return eng;
  }

  persist(): void {
    const snap = vramScheduler.snapshot();
    const loaded: EngineStateRow[] = [...this.engines.values()].map((e) => ({
      id: e.id,
      kind: e.kind,
      port: e.port,
      modelPath: e.modelPath,
      vramMb: e.vramMb,
      pid: e.child.pid ?? null,
    }));
    const file = enginesStatePath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          loaded,
          usedMb: snap.usedMb,
          budgetMb: snap.budgetMb,
          updatedAt: new Date().toISOString(),
        },
        null,
        2,
      ) + '\n',
    );
  }

  async ensureLlama(model: string): Promise<LoadedEngine> {
    return this.ensureEngine(model);
  }

  async ensureEngine(model: string): Promise<LoadedEngine> {
    const loaded = this.get(model);
    if (loaded) return loaded;
    const entry = findEntry(model);
    if (!entry) {
      throw ExceptionFactory.engineUnconfigured(
        `unknown model ${model}; pull a GGUF or use model=echo`,
      );
    }
    const isGguf = Boolean(entry.path?.toLowerCase().endsWith('.gguf'));
    if (isGguf || entry.runtime === 'llamacpp') {
      return this.loadGguf(entry);
    }
    return this.loadVllm(entry);
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
