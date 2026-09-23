import { adminCoreHandlers } from './admin/core.handlers';
import { adminKeysHandlers } from './admin/keys.handlers';
import { adminDocumentsHandlers } from './admin/documents.handlers';
import { adminChatsHandlers } from './admin/chats.handlers';
import { adminConversationsHandlers } from './admin/conversations.handlers';
import { adminPlaygroundHandlers } from './admin/playground.handlers';
import { adminAuditHandlers } from './admin/audit.handlers';
import { adminDdosHandlers } from './admin/ddos.handlers';
import { adminPm2Handlers } from './admin/pm2.handlers';
import { adminQueueHandlers } from './admin/queue.handlers';
import { adminApiFeaturesHandlers } from './admin/api-features.handlers';
import { adminMediaHandlers } from './admin/media.handlers';

/** Composed Admin API handlers (split by domain for maintainability). */
export const adminController = {
  ...adminCoreHandlers,
  ...adminKeysHandlers,
  ...adminDocumentsHandlers,
  ...adminChatsHandlers,
  ...adminConversationsHandlers,
  ...adminPlaygroundHandlers,
  ...adminAuditHandlers,
  ...adminDdosHandlers,
  ...adminPm2Handlers,
  ...adminMediaHandlers,
  apiFeaturesGet: adminApiFeaturesHandlers.get,
  apiFeaturesPut: adminApiFeaturesHandlers.put,
  apiFeaturesPreset: adminApiFeaturesHandlers.preset,
  // Queue control — map to flat names used in routes
  queueStats: adminQueueHandlers.stats,
  queueListJobs: adminQueueHandlers.listJobs,
  queueGetJob: adminQueueHandlers.getJob,
  queueCancelJob: adminQueueHandlers.cancelJob,
  queueRequeueJob: adminQueueHandlers.requeueJob,
  queueSetPriority: adminQueueHandlers.setPriority,
  queueGetPolicy: adminQueueHandlers.getPolicy,
  queuePutPolicy: adminQueueHandlers.putPolicy,
  queuePause: adminQueueHandlers.pause,
  queueResume: adminQueueHandlers.resume,
  queueDrain: adminQueueHandlers.drain,
  queueUndrain: adminQueueHandlers.undrain,
  queuePurgeDead: adminQueueHandlers.purgeDead,
};
