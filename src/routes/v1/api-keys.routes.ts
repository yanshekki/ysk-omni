import { Router } from 'express';
import { apiKeyController } from '../../controllers/api-key.controller';
import { apiKeyIdParamSchema, createApiKeySchema } from '../../dto/api-key.dto';
import { requireAdmin, requireApiKey } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

router.post(
  '/',
  requireApiKey,
  requireAdmin,
  validate(createApiKeySchema, 'body'),
  apiKeyController.create,
);

router.get('/', requireApiKey, requireAdmin, apiKeyController.list);

router.delete(
  '/:id',
  requireApiKey,
  requireAdmin,
  validate(apiKeyIdParamSchema, 'params'),
  apiKeyController.revoke,
);

export default router;
