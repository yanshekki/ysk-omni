import { endpoints } from '../config/endpoints';
import { apiBlob, apiDelete, apiGet } from '../lib/http';
import { buildDocumentsListPath, type DocListFilter } from '../pages/page-api';
import type { ListResponse } from '../types/api/common';

export type DocumentRow = {
  id: string;
  originalName?: string;
  mimeType?: string;
  /** Backend field name */
  sizeBytes?: number;
  byteSize?: number;
  storageType?: string;
  createdAt?: string;
  apiKey?: { name?: string; keyPrefix?: string };
};

export const documentsService = {
  list(params: URLSearchParams | DocListFilter) {
    const path =
      params instanceof URLSearchParams
        ? `${endpoints.documents}?${params}`
        : buildDocumentsListPath(params);
    return apiGet<ListResponse<DocumentRow> & { items?: DocumentRow[] }>(path);
  },

  remove(id: string) {
    return apiDelete(endpoints.document(id));
  },

  downloadBlob(id: string) {
    return apiBlob(endpoints.documentDownload(id));
  },
};
