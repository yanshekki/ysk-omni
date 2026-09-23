import { Router } from 'express';
import { videosController } from '../../controllers/videos.controller';
import { createVideoSchema, videoIdParamSchema } from '../../dto/videos.dto';
import { requireApiKey } from '../../middlewares/auth.middleware';
import {
  chatBurstLimiter,
  chatRateLimiter,
} from '../../middlewares/rate-limit.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.post(
  '/',
  requireApiKey,
  chatRateLimiter,
  chatBurstLimiter,
  validate(createVideoSchema, 'body'),
  videosController.create,
);

router.get(
  '/:id',
  requireApiKey,
  validate(videoIdParamSchema, 'params'),
  videosController.get,
);

router.get(
  '/:id/content',
  requireApiKey,
  validate(videoIdParamSchema, 'params'),
  videosController.content,
);

export default router;
