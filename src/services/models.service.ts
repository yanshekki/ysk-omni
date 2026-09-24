import { env } from '../config/env';
import type { OpenAiModel, OpenAiModelList } from '../interfaces';
import { ExceptionFactory } from '../exceptions/exception.factory';
import {
  assertModelAllowed,
  filterAllowedModels,
} from '../utils/model-allowlist';
import { ECHO_MODEL_ID } from './runtimes/echo';
import {
  loadRegistry,
  type ModelModality,
  type ModelRuntime,
  type RegistryEntry,
} from './hf/registry';
import { engineManager } from './runtimes/engine-manager';

/** Local Piper voice used by the media worker. */
export const PIPER_MODEL_ID = 'piper/lessac-high';
/** OpenAI-compatible speech model id (DTO default). */
export const OPENAI_TTS_MODEL_ID = 'tts-1';
/** OpenAI-compatible transcription model id. */
export const OPENAI_STT_MODEL_ID = 'whisper-1';

export type UsableModel = {
  id: string;
  modality: ModelModality;
  runtime: ModelRuntime;
};

export const BUILTIN_USABLE_MODELS: readonly UsableModel[] = [
  { id: PIPER_MODEL_ID, modality: 'tts', runtime: 'tts' },
  { id: OPENAI_TTS_MODEL_ID, modality: 'tts', runtime: 'tts' },
  { id: OPENAI_STT_MODEL_ID, modality: 'stt', runtime: 'whisper' },
];

/** Loaded engines first, then registry, echo last. */
export function orderModelIds(opts: {
  echoId: string;
  registryIds: string[];
  loadedIds: string[];
}): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (id: string, allowEcho = false) => {
    const v = (id || '').trim();
    if (!v || seen.has(v)) return;
    if (!allowEcho && v === opts.echoId) return;
    seen.add(v);
    out.push(v);
  };
  for (const id of opts.loadedIds) add(id);
  for (const id of opts.registryIds) add(id);
  add(opts.echoId, true);
  return out;
}

export function preferredChatModel(ids: string[], echoId: string): string {
  return ids.find((id) => id !== echoId) || echoId;
}

/** Loaded engines, registry (all modalities), builtins, echo last. */
export function buildUsableCatalog(opts: {
  echoId: string;
  registry: Array<Pick<RegistryEntry, 'id' | 'modality' | 'runtime'>>;
  loaded: Array<{ id: string; kind?: string }>;
  builtins?: readonly UsableModel[];
}): UsableModel[] {
  const seen = new Set<string>();
  const out: UsableModel[] = [];
  const add = (row: UsableModel, allowEcho = false) => {
    const id = (row.id || '').trim();
    if (!id || seen.has(id)) return;
    if (!allowEcho && id === opts.echoId) return;
    seen.add(id);
    out.push({ ...row, id });
  };
  const registryById = new Map(opts.registry.map((r) => [r.id, r]));
  for (const e of opts.loaded) {
    const id = (e.id || '').trim();
    if (!id) continue;
    const reg = registryById.get(id);
    const kind = e.kind === 'vllm' ? 'vllm' : 'llamacpp';
    add({
      id,
      modality: reg?.modality || 'text',
      runtime: (reg?.runtime as ModelRuntime) || kind,
    });
  }
  for (const r of opts.registry) {
    add({ id: r.id, modality: r.modality, runtime: r.runtime });
  }
  for (const b of opts.builtins ?? BUILTIN_USABLE_MODELS) add(b);
  add({ id: opts.echoId, modality: 'text', runtime: 'echo' }, true);
  return out;
}

export class ModelsService {
  private cache: { models: string[]; fetchedAt: number; source: string } | null =
    null;
  private readonly ttlMs = 5 * 60 * 1000;

  async list(allowedModels?: string[] | null): Promise<OpenAiModelList> {
    const catalog = await this.getUsableCatalog();
    const ids = filterAllowedModels(
      catalog.map((m) => m.id),
      allowedModels,
    );
    const byId = new Map(catalog.map((m) => [m.id, m]));
    const created = Math.floor(Date.now() / 1000);
    return {
      object: 'list',
      data: ids.map((id) => toOpenAiModel(byId.get(id)!, created)),
    };
  }

  async get(
    modelId: string,
    allowedModels?: string[] | null,
  ): Promise<OpenAiModel> {
    const catalog = await this.getUsableCatalog();
    const row = catalog.find((m) => m.id === modelId);
    if (!row) {
      throw ExceptionFactory.notFound('Model');
    }
    assertModelAllowed({ allowedModels: allowedModels ?? [] }, modelId);
    return toOpenAiModel(row, Math.floor(Date.now() / 1000));
  }

  clearCache(): void {
    this.cache = null;
  }

  async getModelIds(forceRefresh = false): Promise<string[]> {
    const now = Date.now();
    if (
      !forceRefresh &&
      this.cache &&
      now - this.cache.fetchedAt < this.ttlMs
    ) {
      return this.cache.models;
    }

    const registryIds = loadRegistry().models.map((m) => m.id);
    const loadedIds = engineManager.list().map((e) => e.id);
    const models = orderModelIds({
      echoId: ECHO_MODEL_ID,
      registryIds,
      loadedIds,
    });
    this.cache = { models, fetchedAt: now, source: 'registry' };
    return models;
  }

  /** Models this gateway can name, for GET /v1/models (then key-filtered). */
  async getUsableCatalog(): Promise<UsableModel[]> {
    const registry = loadRegistry().models;
    const loadedIds = engineManager.list().map((e) => ({
      id: e.id,
      kind: e.kind,
    }));
    return buildUsableCatalog({
      echoId: ECHO_MODEL_ID,
      registry,
      loaded: loadedIds,
    });
  }

  async getModelCatalog(forceRefresh = false): Promise<{
    models: string[];
    source: string;
    defaultModel: string;
    fetchedAt: number;
  }> {
    const models = await this.getModelIds(forceRefresh);
    const envDefault = env.OMNI_DEFAULT_MODEL?.trim();
    const defaultModel =
      envDefault && envDefault !== ECHO_MODEL_ID && models.includes(envDefault)
        ? envDefault
        : preferredChatModel(models, ECHO_MODEL_ID);
    return {
      models,
      source: this.cache?.source ?? 'registry',
      defaultModel,
      fetchedAt: this.cache?.fetchedAt ?? Date.now(),
    };
  }
}

export const modelsService = new ModelsService();

function toOpenAiModel(row: UsableModel, created: number): OpenAiModel {
  return {
    id: row.id,
    object: 'model',
    created,
    owned_by: 'ysk-omni',
    modality: row.modality,
    runtime: row.runtime,
  };
}
