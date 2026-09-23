import { Router } from 'express';
import { chatController } from '../../controllers/chat.controller';
import { createChatCompletionSchema } from '../../dto/chat.dto';
import { requireApiKey } from '../../middlewares/auth.middleware';
import {
  chatBurstLimiter,
  chatRateLimiter,
} from '../../middlewares/rate-limit.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

// Note: concurrencyGuard removed — durable chat queue handles admission
router.post(
  '/completions',
  requireApiKey,
  chatRateLimiter,
  chatBurstLimiter,
  validate(createChatCompletionSchema, 'body'),
  chatController.createCompletion,
);

export default router;
