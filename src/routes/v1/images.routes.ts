import { Router } from 'express';
import { imagesController } from '../../controllers/images.controller';
import { createImageGenerationSchema } from '../../dto/images.dto';
import { requireApiKey } from '../../middlewares/auth.middleware';
import { uploadImageEdit } from '../../middlewares/upload-images.middleware';
import {
  chatBurstLimiter,
  chatRateLimiter,
} from '../../middlewares/rate-limit.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.post(
  '/generations',
  requireApiKey,
  chatRateLimiter,
  chatBurstLimiter,
  validate(createImageGenerationSchema, 'body'),
  imagesController.createGeneration,
);

router.post(
  '/edits',
  requireApiKey,
  chatRateLimiter,
  chatBurstLimiter,
  uploadImageEdit,
  imagesController.createEdit,
);

export default router;
