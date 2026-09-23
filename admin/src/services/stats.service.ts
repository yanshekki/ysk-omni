import { endpoints } from '../config/endpoints';
import { apiGet } from '../lib/http';
import type { StatsResponse } from '../types/api/stats';

export const statsService = {
  get(): Promise<StatsResponse> {
    return apiGet<StatsResponse>(endpoints.stats);
  },
};
