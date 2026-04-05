import { Router } from 'express';
import { saveCredentials, completeOnboarding, deleteUser, generateKnowledgeDraft, getIndustryTemplate } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Apply requireAuth to all user routes
router.use(requireAuth);

router.post('/credentials', saveCredentials);
router.post('/onboarding', completeOnboarding);
router.post('/generate-knowledge', generateKnowledgeDraft);
router.get('/templates', getIndustryTemplate);
router.delete('/', deleteUser);

export default router;
