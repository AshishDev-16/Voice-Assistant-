import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller';

const router = Router();

router.post('/order', createOrder);
router.post('/verify', verifyPayment);

export default router;
