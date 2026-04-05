import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Apply requireAuth to all payment routes
router.use(requireAuth);

router.post('/order', createOrder);
router.post('/verify', verifyPayment);

export default router;
