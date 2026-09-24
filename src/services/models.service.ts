import { env } from '../config/env';
import type { OpenAiModel, OpenAiModelList } from '../interfaces';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { mapModelsList } from '../utils/openai-mapper';
import {
  assertModelAllowed,
  filterAllowedModels,
} from '../utils/model-allowlist';
import { ECHO_MODEL_ID } from './runtimes/echo';
import { loadRegistry } from './hf/registry';
import { engineManager } from './runtimes/engine-manager';

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

export class ModelsService {
  private cache: { models: string[]; fetchedAt: number; source: string } | null =
    null;
  private readonly ttlMs = 5 * 60 * 1000;

  async list(allowedModels?: string[] | null): Promise<OpenAiModelList> {
    const models = filterAllowedModels(
      await this.getModelIds(),
      allowedModels,
    );
    const body = mapModelsList(models);
    body.data = body.data.map((m) => ({
      ...m,
      owned_by: m.id === ECHO_MODEL_ID ? 'ysk-omni' : m.owned_by || 'ysk-omni',
    }));
    return body;
  }

  async get(
    modelId: string,
    allowedModels?: string[] | null,
  ): Promise<OpenAiModel> {
    const models = await this.getModelIds();
    if (!models.includes(modelId)) {
      throw ExceptionFactory.notFound('Model');
    }
    assertModelAllowed({ allowedModels: allowedModels ?? [] }, modelId);
    return {
      id: modelId,
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'ysk-omni',
    };
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

  async getModelCatalog(forceRefresh = false): Promise<{
    models: string[];
    source: string;
    defaultModel: string;
    fetchedAt: number;
  }> {
    const models = await this.getModelIds(forceRefresh);
    const envDefault = env.GROK_DEFAULT_MODEL?.trim();
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
