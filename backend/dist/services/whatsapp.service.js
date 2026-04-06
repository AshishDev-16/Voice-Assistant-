"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Service to interact with the WhatsApp Cloud API.
 */
const sendWhatsAppMessage = async (phoneNumberId, to, text, customToken) => {
    try {
        const token = customToken || process.env.WHATSAPP_API_TOKEN;
        if (!token) {
            throw new Error('No WHATSAPP_API_TOKEN provided and no fallback configured');
        }
        const version = process.env.WHATSAPP_API_VERSION || 'v17.0';
        const url = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;
        const payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'text',
            text: {
                preview_url: false,
                body: text
            }
        };
        const response = await axios_1.default.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        logger_1.default.info(`Message sent to ${to} successfully. Message ID: ${response.data.messages[0].id}`);
    }
    catch (error) {
        logger_1.default.error(`Failed to send WhatsApp message to ${to}:`, error.response?.data || error.message);
        throw error;
    }
};
exports.sendWhatsAppMessage = sendWhatsAppMessage;
