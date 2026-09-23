import { endpoints } from '../config/endpoints';
import { apiGet, apiPost, apiPut } from '../lib/http';
import type {
  ApiFeatureKey,
  ApiFeaturesResponse,
  FeaturePresetName,
} from '../types/api/features';

export const featuresService = {
  get() {
    return apiGet<ApiFeaturesResponse>(endpoints.apiFeatures);
  },

  update(partial: Partial<Record<ApiFeatureKey, boolean>>) {
    return apiPut<ApiFeaturesResponse>(endpoints.apiFeatures, partial);
  },

  applyPreset(name: FeaturePresetName) {
    return apiPost<ApiFeaturesResponse>(endpoints.apiFeaturesPreset, { name });
  },
};
