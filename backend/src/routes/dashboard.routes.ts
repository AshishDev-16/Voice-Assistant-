import { Router } from 'express';
import { getDashboardStats, getAppointments, getUsage } from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/appointments', getAppointments);
router.get('/usage', getUsage);

export default router;
