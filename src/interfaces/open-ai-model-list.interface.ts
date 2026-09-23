import type { OpenAiModel } from './open-ai-model.interface';

export interface OpenAiModelList {
  object: 'list';
  data: OpenAiModel[];
}
