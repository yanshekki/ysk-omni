import { Router } from 'express';
import { documentController } from '../../controllers/document.controller';
import { documentIdParamSchema, listDocumentsSchema } from '../../dto/document.dto';
import { requireApiKey } from '../../middlewares/auth.middleware';
import { uploadSingle } from '../../middlewares/upload.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.post('/', requireApiKey, uploadSingle, documentController.upload);
router.get(
  '/',
  requireApiKey,
  validate(listDocumentsSchema, 'query'),
  documentController.list,
);
router.get(
  '/:id',
  requireApiKey,
  validate(documentIdParamSchema, 'params'),
  documentController.get,
);
router.delete(
  '/:id',
  requireApiKey,
  validate(documentIdParamSchema, 'params'),
  documentController.remove,
);

export default router;
