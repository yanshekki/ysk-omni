import { Router } from 'express';
import { responsesController } from '../../controllers/responses.controller';
import { createResponseSchema } from '../../dto/responses.dto';
import { requireApiKey } from '../../middlewares/auth.middleware';
import {
  chatBurstLimiter,
  chatRateLimiter,
} from '../../middlewares/rate-limit.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

/** OpenAI Responses API (text subset + store) */
router.post(
  '/',
  requireApiKey,
  chatRateLimiter,
  chatBurstLimiter,
  validate(createResponseSchema, 'body'),
  responsesController.create,
);
router.get('/:id', requireApiKey, responsesController.get);
router.delete('/:id', requireApiKey, responsesController.remove);

export default router;
