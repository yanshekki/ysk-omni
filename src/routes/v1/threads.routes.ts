import { Router } from 'express';
import { assistantsController } from '../../controllers/assistants.controller';
import { requireApiKey } from '../../middlewares/auth.middleware';
import {
  chatBurstLimiter,
  chatRateLimiter,
} from '../../middlewares/rate-limit.middleware';

const router = Router();

router.use(requireApiKey, chatRateLimiter, chatBurstLimiter);

router.post('/', assistantsController.createThread);
router.get('/:id', assistantsController.getThread);
router.post('/:threadId/messages', assistantsController.createMessage);
router.get('/:threadId/messages', assistantsController.listMessages);
router.post('/:threadId/runs', assistantsController.createRun);

export default router;
