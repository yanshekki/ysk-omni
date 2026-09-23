import { Router } from 'express';
import { modelsController } from '../../controllers/models.controller';
import { requireApiKey } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', requireApiKey, modelsController.list);
router.post('/pull', requireApiKey, modelsController.pull);
router.get('/:model', requireApiKey, modelsController.get);

export default router;
