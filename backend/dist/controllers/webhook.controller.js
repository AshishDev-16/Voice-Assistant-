"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.verifyWebhook = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const message_processor_1 = require("../services/message.processor");
/**
 * Handles the webhook verification request from WhatsApp Cloud API.
 */
const verifyWebhook = (req, res) => {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode && token) {
        if (mode === 'subscribe' && token === verifyToken) {
            logger_1.default.info('Webhook verified successfully');
            res.status(200).send(challenge);
        }
        else {
            logger_1.default.warn('Webhook verification failed: Invalid token');
            res.sendStatus(403);
        }
    }
    else {
        res.sendStatus(400);
    }
};
exports.verifyWebhook = verifyWebhook;
/**
 * Handles incoming webhook events (e.g., messages) from WhatsApp.
 */
const handleWebhook = async (req, res) => {
    try {
        const body = req.body;
        // Check if it's from the WhatsApp API
        if (body.object === 'whatsapp_business_account') {
            if (body.entry && body.entry.length > 0) {
                for (const entry of body.entry) {
                    const changes = entry.changes;
                    if (!changes || changes.length === 0)
                        continue;
                    for (const change of changes) {
                        const value = change.value;
                        // Proceed only if there's a message
                        if (value.messages && value.messages.length > 0) {
                            const message = value.messages[0];
                            const contact = value.contacts?.[0];
                            const metadata = value.metadata;
                            // Only process text messages in this basic example
                            if (message.type === 'text' && message.text) {
                                const parsedMsg = {
                                    phoneNumberId: metadata.phone_number_id,
                                    customerPhone: message.from,
                                    customerName: contact?.profile?.name,
                                    messageId: message.id,
                                    messageText: message.text.body,
                                    messageType: message.type,
                                    timestamp: message.timestamp
                                };
                                logger_1.default.info(`Received ${message.type} message from ${parsedMsg.customerPhone}`);
                                // Pass the extracted message to the orchestrator/processor service asynchronously
                                // We don't await because WhatsApp requires a 200 OK immediately
                                (0, message_processor_1.processIncomingMessage)(parsedMsg).catch(err => {
                                    logger_1.default.error('Error processing incoming message in background:', err);
                                });
                            }
                            else {
                                logger_1.default.info(`Received unhandled message type: ${message.type}`);
                            }
                        }
                    }
                }
            }
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (error) {
        logger_1.default.error('Error handling webhook payload:', error);
        res.sendStatus(500);
    }
};
exports.handleWebhook = handleWebhook;
