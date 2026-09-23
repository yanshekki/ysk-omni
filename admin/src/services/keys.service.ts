import { endpoints } from '../config/endpoints';
import { apiDelete, apiGet, apiPatch, apiPost } from '../lib/http';
import { buildKeysListPath, parseDataList } from '../pages/page-api';
import type {
  ApiKeyRow,
  CreateKeyBody,
  KeysListResponse,
  UpdateKeyBody,
} from '../types/api/keys';
import { patchState } from '../state/store';

export type KeysListQuery = {
  q?: string;
  role?: string;
  mode?: string;
  isActive?: string;
  limit?: number;
  offset?: number;
  all?: boolean;
};

export const keysService = {
  list(query: KeysListQuery = {}) {
    return apiGet<KeysListResponse>(buildKeysListPath(query));
  },

  async loadAllIntoState(): Promise<ApiKeyRow[]> {
    try {
      const res = await this.list({ all: true });
      const { rows } = parseDataList(res);
      const data = rows as unknown as ApiKeyRow[];
      patchState({ keys: data as unknown as Array<Record<string, unknown>> });
      return data;
    } catch {
      patchState({ keys: [] });
      return [];
    }
  },

  create(body: CreateKeyBody) {
    return apiPost<{ object: string; data: ApiKeyRow }>(endpoints.keys, body);
  },

  update(id: string, body: UpdateKeyBody) {
    return apiPatch<{ object: string; data: ApiKeyRow }>(
      endpoints.key(id),
      body,
    );
  },

  revoke(id: string) {
    return apiDelete(endpoints.key(id));
  },
};
