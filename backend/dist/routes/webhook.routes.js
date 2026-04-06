"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webhook_controller_1 = require("../controllers/webhook.controller");
const router = (0, express_1.Router)();
// Route for WhatsApp webhook verification (GET)
router.get('/whatsapp', webhook_controller_1.verifyWebhook);
// Route for receiving WhatsApp messages (POST)
router.post('/whatsapp', webhook_controller_1.handleWebhook);
exports.default = router;
