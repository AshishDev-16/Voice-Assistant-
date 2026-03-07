import { Router } from 'express';
import { verifyWebhook, handleWebhook } from '../controllers/webhook.controller';

const router = Router();

// Route for WhatsApp webhook verification (GET)
router.get('/whatsapp', verifyWebhook);

// Route for receiving WhatsApp messages (POST)
router.post('/whatsapp', handleWebhook);

export default router;
