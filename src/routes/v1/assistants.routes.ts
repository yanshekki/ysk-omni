import { Router } from 'express';
import { assistantsController } from '../../controllers/assistants.controller';
import { requireApiKey } from '../../middlewares/auth.middleware';

const router = Router();

router.use(requireApiKey);

router.post('/', assistantsController.createAssistant);
router.get('/', assistantsController.listAssistants);
router.get('/:id', assistantsController.getAssistant);
router.delete('/:id', assistantsController.deleteAssistant);

export default router;
