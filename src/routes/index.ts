import { Router } from 'express';
import { healthController } from '../controllers/health.controller';
import chatRoutes from './v1/chat.routes';
import modelsRoutes from './v1/models.routes';
import documentsRoutes from './v1/documents.routes';
import apiKeysRoutes from './v1/api-keys.routes';
import messagesRoutes from './v1/messages.routes';
import responsesRoutes from './v1/responses.routes';
import assistantsRoutes from './v1/assistants.routes';
import threadsRoutes from './v1/threads.routes';
import imagesRoutes from './v1/images.routes';
import mediaAssetsRoutes from './v1/media-assets.routes';
import filesRoutes from './v1/files.routes';
import videosRoutes from './v1/videos.routes';
import audioRoutes from './v1/audio.routes';

const router = Router();

router.get('/health', healthController.health);
router.get('/ready', healthController.ready);

router.use('/v1/chat', chatRoutes);
router.use('/v1/models', modelsRoutes);
router.use('/v1/documents', documentsRoutes);
router.use('/v1/api-keys', apiKeysRoutes);
/** Anthropic Messages compatibility */
router.use('/v1/messages', messagesRoutes);
/** OpenAI Responses compatibility (text subset + store) */
router.use('/v1/responses', responsesRoutes);
/** Assistants-lite (feature-flagged) */
router.use('/v1/assistants', assistantsRoutes);
router.use('/v1/threads', threadsRoutes);
/** OpenAI Images API (media pipeline — Grok tools / mock provider) */
router.use('/v1/images', imagesRoutes);
/** Stored media artifacts (download by id) */
router.use('/v1/media/assets', mediaAssetsRoutes);
/** OpenAI Files alias (documents + media) — feature filesOpenAiAlias */
router.use('/v1/files', filesRoutes);
/** OpenAI-style video jobs (async) — feature videoApi */
router.use('/v1/videos', videosRoutes);
/** OpenAI Audio (TTS/STT) — feature audioApi + provider env */
router.use('/v1/audio', audioRoutes);

export default router;
