import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Apply requireAuth to all profile routes
router.use(requireAuth);

router.get('/', getProfile);
router.post('/', updateProfile);

export default router;
