import { Router } from 'express';
import { filesController } from '../../controllers/files.controller';
import { fileIdParamSchema } from '../../dto/files.dto';
import { requireApiKey } from '../../middlewares/auth.middleware';
import { uploadSingle } from '../../middlewares/upload.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.post('/', requireApiKey, uploadSingle, filesController.create);
router.get('/', requireApiKey, filesController.list);
router.get(
  '/:id',
  requireApiKey,
  validate(fileIdParamSchema, 'params'),
  filesController.get,
);
router.get(
  '/:id/content',
  requireApiKey,
  validate(fileIdParamSchema, 'params'),
  filesController.content,
);
router.delete(
  '/:id',
  requireApiKey,
  validate(fileIdParamSchema, 'params'),
  filesController.remove,
);

export default router;
