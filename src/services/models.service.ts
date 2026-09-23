import { env } from '../config/env';
import type { OpenAiModel, OpenAiModelList } from '../interfaces';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { mapModelsList } from '../utils/openai-mapper';
import { ECHO_MODEL_ID } from './runtimes/echo';
import { loadRegistry } from './hf/registry';

export class ModelsService {
  private cache: { models: string[]; fetchedAt: number; source: string } | null =
    null;
  private readonly ttlMs = 5 * 60 * 1000;

  async list(): Promise<OpenAiModelList> {
    const models = await this.getModelIds();
    const body = mapModelsList(models);
    body.data = body.data.map((m) => ({
      ...m,
      owned_by: m.id === ECHO_MODEL_ID ? 'ysk-omni' : m.owned_by || 'ysk-omni',
    }));
    return body;
  }

  async get(modelId: string): Promise<OpenAiModel> {
    const models = await this.getModelIds();
    if (!models.includes(modelId)) {
      throw ExceptionFactory.notFound('Model');
    }
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

    const ids = new Set<string>([ECHO_MODEL_ID]);
    for (const m of loadRegistry().models) {
      ids.add(m.id);
    }
    const models = [...ids];
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
    return {
      models,
      source: this.cache?.source ?? 'registry',
      defaultModel: env.GROK_DEFAULT_MODEL || ECHO_MODEL_ID,
      fetchedAt: this.cache?.fetchedAt ?? Date.now(),
    };
  }
}

export const modelsService = new ModelsService();
