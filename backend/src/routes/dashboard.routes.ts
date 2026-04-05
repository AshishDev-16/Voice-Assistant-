import { Router } from 'express';
import { getDashboardStats, getIntelligence, getUsage } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Apply requireAuth to all dashboard routes
router.use(requireAuth);

router.get('/stats', getDashboardStats);
router.get('/intelligence', getIntelligence);
router.get('/usage', getUsage);

export default router;
