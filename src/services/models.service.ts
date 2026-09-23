import { env } from '../config/env';
import type { OpenAiModel, OpenAiModelList } from '../interfaces';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { mapModelsList } from '../utils/openai-mapper';

export class ModelsService {
  private cache: { models: string[]; fetchedAt: number; source: string } | null =
    null;
  private readonly ttlMs = 5 * 60 * 1000;

  async list(): Promise<OpenAiModelList> {
    const models = await this.getModelIds();
    return mapModelsList(models);
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

    const models: string[] = [];
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
      source: this.cache?.source ?? 'fallback',
      defaultModel: env.GROK_DEFAULT_MODEL,
      fetchedAt: this.cache?.fetchedAt ?? Date.now(),
    };
  }
}

export const modelsService = new ModelsService();
