import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import {
  adminCreateKeySchema,
  adminIdParamSchema,
  adminIpBanSchema,
  adminListQuerySchema,
  adminUpdateKeySchema,
  adminUpdateSettingsSchema,
} from '../dto/admin.dto';
import { ddosPolicyUpdateSchema } from '../dto/ddos.dto';
import { adminPlaygroundChatSchema } from '../dto/chat.dto';
import { createImageGenerationSchema } from '../dto/images.dto';
import { z } from 'zod';
import {
  conversationListQuerySchema,
  createConversationSchema,
  updateConversationSchema,
} from '../dto/conversation.dto';
import { requireAdminAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';
import { uploadImageEdit } from '../middlewares/upload-images.middleware';
import { env } from '../config/env';
import { ExceptionFactory } from '../exceptions/exception.factory';
import { settingsService } from '../services/settings.service';
import { asyncHandler } from '../utils/async-handler';
import { adminAuthHandlers } from '../controllers/admin/auth.handlers';
import { adminOtpLoginSchema } from '../dto/admin-auth.dto';
import {
  adminApiLimiter,
  chatBurstLimiter,
  chatRateLimiter,
} from '../middlewares/rate-limit.middleware';

const router = Router();

const ensureAdminPanel = asyncHandler(async (_req, _res, next) => {
  if (!env.ADMIN_PANEL_ENABLED) {
    throw ExceptionFactory.forbidden('Admin panel disabled by env');
  }
  const settings = await settingsService.getAll();
  if (!settings.adminPanelEnabled) {
    throw ExceptionFactory.forbidden('Admin panel disabled in settings');
  }
  next();
});

router.use(ensureAdminPanel);
router.use(adminApiLimiter);

// Public: OTP → session (rate-limited via global + burst helpers)
router.post(
  '/auth/login',
  chatRateLimiter,
  chatBurstLimiter,
  validate(adminOtpLoginSchema, 'body'),
  adminAuthHandlers.login,
);

// Authenticated admin (session token OR admin API key)
router.use(requireAdminAuth);

router.post('/auth/logout', adminAuthHandlers.logout);
router.get('/me', adminController.me);
// Admin chat playground (select API key by id — no raw secret)
router.post(
  '/chat/completions',
  validate(adminPlaygroundChatSchema, 'body'),
  adminController.playgroundChat,
);
router.post(
  '/documents',
  uploadSingle,
  adminController.playgroundUpload,
);

router.get('/stats', adminController.stats);
router.get('/usage', adminController.usage);
router.get('/models', adminController.models);
router.get('/system', adminController.system);
router.get('/grok/inspect', adminController.grokInspect);
router.get('/grok/sessions', adminController.grokSessionsList);
router.delete(
  '/grok/sessions/:id',
  validate(adminIdParamSchema, 'params'),
  adminController.grokSessionsDelete,
);
router.get('/system/update-check', adminController.checkUpdate);
router.post('/system/update', adminController.runUpdate);

router.get('/chats', validate(adminListQuerySchema, 'query'), adminController.listChats);
router.get('/chats/:id', validate(adminIdParamSchema, 'params'), adminController.getChat);

// Playground multi-turn conversation threads
router.get(
  '/conversations',
  validate(conversationListQuerySchema, 'query'),
  adminController.listConversations,
);
router.get(
  '/conversations/:id',
  validate(adminIdParamSchema, 'params'),
  adminController.getConversation,
);
router.post(
  '/conversations',
  validate(createConversationSchema, 'body'),
  adminController.createConversation,
);
router.patch(
  '/conversations/:id',
  validate(adminIdParamSchema, 'params'),
  validate(updateConversationSchema, 'body'),
  adminController.updateConversation,
);
router.delete(
  '/conversations/:id',
  validate(adminIdParamSchema, 'params'),
  adminController.deleteConversation,
);

router.get('/keys', adminController.listKeys);
router.post('/keys', validate(adminCreateKeySchema, 'body'), adminController.createKey);
router.patch(
  '/keys/:id',
  validate(adminIdParamSchema, 'params'),
  validate(adminUpdateKeySchema, 'body'),
  adminController.updateKey,
);
router.delete(
  '/keys/:id',
  validate(adminIdParamSchema, 'params'),
  adminController.revokeKey,
);

router.get(
  '/documents',
  validate(adminListQuerySchema, 'query'),
  adminController.listDocuments,
);
router.get(
  '/documents/:id/download',
  validate(adminIdParamSchema, 'params'),
  adminController.downloadDocument,
);
router.get(
  '/documents/:id',
  validate(adminIdParamSchema, 'params'),
  adminController.getDocument,
);
router.delete(
  '/documents/:id',
  validate(adminIdParamSchema, 'params'),
  adminController.deleteDocument,
);

router.get(
  '/audit-logs',
  validate(adminListQuerySchema, 'query'),
  adminController.listAudit,
);

router.get('/settings', adminController.getSettings);
router.put(
  '/settings',
  validate(adminUpdateSettingsSchema, 'body'),
  adminController.updateSettings,
);

// API protocol + Grok capability feature flags
router.get('/api-features', adminController.apiFeaturesGet);
router.put('/api-features', adminController.apiFeaturesPut);
router.post('/api-features/preset', adminController.apiFeaturesPreset);

// Generated media assets + video jobs
router.get('/media/assets', adminController.listAssets);
router.get(
  '/media/assets/:id',
  validate(adminIdParamSchema, 'params'),
  adminController.getAsset,
);
router.get(
  '/media/assets/:id/download',
  validate(adminIdParamSchema, 'params'),
  adminController.downloadAsset,
);
router.delete(
  '/media/assets/:id',
  validate(adminIdParamSchema, 'params'),
  adminController.deleteAsset,
);
router.get('/media/jobs', adminController.listJobs);
router.post(
  '/media/generate',
  validate(
    createImageGenerationSchema.extend({
      apiKeyId: z.string().uuid().optional(),
    }),
    'body',
  ),
  adminController.generateImage,
);
router.post(
  '/media/edit',
  uploadImageEdit,
  adminController.editImage,
);
router.post(
  '/media/videos',
  // Optional source frame upload (field `image`) + form fields, or pure JSON body
  uploadImageEdit,
  adminController.createVideo,
);

// DDoS control center
router.get('/ddos/connections', adminController.ddosConnections);
router.get('/ddos/blacklist', adminController.ddosBlacklist);
router.get('/ddos/stats', adminController.ddosStats);
router.get('/ddos/policy', adminController.ddosPolicyGet);
router.get('/ddos/events', adminController.ddosEvents);
router.put(
  '/ddos/policy',
  validate(ddosPolicyUpdateSchema, 'body'),
  adminController.ddosPolicyPut,
);
router.post('/ddos/policy/reset', adminController.ddosPolicyReset);
router.post(
  '/ddos/blacklist',
  validate(adminIpBanSchema, 'body'),
  adminController.ddosBan,
);
router.delete('/ddos/blacklist/:ip', adminController.ddosUnban);

// PM2 control + config + runner switch
router.get('/pm2/status', adminController.pm2Status);
router.post('/pm2/start', adminController.pm2Start);
router.post('/pm2/stop', adminController.pm2Stop);
router.post('/pm2/restart', adminController.pm2Restart);
router.post('/pm2/reload', adminController.pm2Reload);
router.get('/pm2/logs', adminController.pm2Logs);
router.post('/pm2/logs/clear', adminController.pm2ClearLogs);
router.get('/pm2/config', adminController.pm2GetConfig);
router.put('/pm2/config', adminController.pm2SaveConfig);
router.post('/pm2/config/reset', adminController.pm2ResetConfig);
router.post('/pm2/switch', adminController.pm2Switch);

// Chat work queue control center
router.get('/queue/stats', adminController.queueStats);
router.get('/queue/jobs', adminController.queueListJobs);
router.get('/queue/jobs/:id', validate(adminIdParamSchema, 'params'), adminController.queueGetJob);
router.post(
  '/queue/jobs/:id/cancel',
  validate(adminIdParamSchema, 'params'),
  adminController.queueCancelJob,
);
router.post(
  '/queue/jobs/:id/requeue',
  validate(adminIdParamSchema, 'params'),
  adminController.queueRequeueJob,
);
router.post(
  '/queue/jobs/:id/priority',
  validate(adminIdParamSchema, 'params'),
  adminController.queueSetPriority,
);
router.get('/queue/policy', adminController.queueGetPolicy);
router.put('/queue/policy', adminController.queuePutPolicy);
router.post('/queue/pause', adminController.queuePause);
router.post('/queue/resume', adminController.queueResume);
router.post('/queue/drain', adminController.queueDrain);
router.post('/queue/undrain', adminController.queueUndrain);
router.post('/queue/purge-dead', adminController.queuePurgeDead);

export default router;
