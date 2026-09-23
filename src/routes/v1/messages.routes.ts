import { Router } from 'express';
import { anthropicController } from '../../controllers/anthropic.controller';
import { anthropicMessagesSchema } from '../../dto/anthropic-messages.dto';
import { requireApiKey } from '../../middlewares/auth.middleware';
import {
  chatBurstLimiter,
  chatRateLimiter,
} from '../../middlewares/rate-limit.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

/** Anthropic Messages API: POST /v1/messages */
router.post(
  '/',
  requireApiKey,
  chatRateLimiter,
  chatBurstLimiter,
  validate(anthropicMessagesSchema, 'body'),
  anthropicController.createMessage,
);

export default router;
