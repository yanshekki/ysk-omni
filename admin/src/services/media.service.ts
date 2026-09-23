import { endpoints } from '../config/endpoints';
import { apiBlob, apiDelete, apiGet } from '../lib/http';
import {
  buildMediaAssetsPath,
  buildMediaJobsPath,
} from '../pages/page-api';
import type { MediaAssetsList, MediaJobsList } from '../types/api/media';

export const mediaService = {
  listAssets(opts: { kind?: string; limit?: number; offset?: number } = {}) {
    return apiGet<MediaAssetsList>(buildMediaAssetsPath(opts));
  },

  listJobs(opts: { limit?: number } = {}) {
    return apiGet<MediaJobsList>(buildMediaJobsPath(opts.limit ?? 30));
  },

  remove(id: string) {
    return apiDelete(endpoints.mediaAsset(id));
  },

  downloadBlob(id: string) {
    return apiBlob(endpoints.mediaAssetDownload(id));
  },
};
