import { Router } from 'express';
import { audioController } from '../../controllers/audio.controller';
import { createSpeechSchema } from '../../dto/audio.dto';
import { requireApiKey } from '../../middlewares/auth.middleware';
import { uploadSingle } from '../../middlewares/upload.middleware';
import {
  chatBurstLimiter,
  chatRateLimiter,
} from '../../middlewares/rate-limit.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.post(
  '/speech',
  requireApiKey,
  chatRateLimiter,
  chatBurstLimiter,
  validate(createSpeechSchema, 'body'),
  audioController.speech,
);

router.post(
  '/transcriptions',
  requireApiKey,
  chatRateLimiter,
  chatBurstLimiter,
  uploadSingle,
  audioController.transcriptions,
);

export default router;
