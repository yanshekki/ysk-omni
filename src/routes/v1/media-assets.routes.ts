import { Router } from 'express';
import { mediaAssetsController } from '../../controllers/media-assets.controller';
import { mediaAssetIdParamSchema } from '../../dto/images.dto';
import { requireApiKey } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.get(
  '/:id',
  requireApiKey,
  validate(mediaAssetIdParamSchema, 'params'),
  mediaAssetsController.get,
);

router.get(
  '/:id/content',
  requireApiKey,
  validate(mediaAssetIdParamSchema, 'params'),
  mediaAssetsController.content,
);

export default router;
