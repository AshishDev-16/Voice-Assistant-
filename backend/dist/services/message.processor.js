"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processIncomingMessage = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const ai_service_1 = require("./ai.service");
const whatsapp_service_1 = require("./whatsapp.service");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const Business_1 = require("../models/Business");
// Simple Mongoose schema for storing Conversation data
const messageSchema = new mongoose_1.default.Schema({
    customerPhone: { type: String, required: true },
    messageId: { type: String, required: true, unique: true },
    messageText: { type: String, required: true },
    messageType: { type: String, required: true },
    direction: { type: String, enum: ['inbound', 'outbound'], required: true },
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose_1.default.model('Message', messageSchema);
/**
 * Orchestrates the flow: DB storage -> History Retrieval -> AI Generation -> Sending Reply
 */
const processIncomingMessage = async (parsedMsg) => {
    try {
        logger_1.default.info(`Starting processing for message from ${parsedMsg.customerPhone}`);
        // 1. Store the incoming message in MongoDB
        try {
            await Message.create({
                customerPhone: parsedMsg.customerPhone,
                messageId: parsedMsg.messageId,
                messageText: parsedMsg.messageText,
                messageType: parsedMsg.messageType,
                direction: 'inbound',
                timestamp: new Date(Number(parsedMsg.timestamp) * 1000)
            });
            logger_1.default.info('Inbound message saved to database');
        }
        catch (dbErr) {
            logger_1.default.error('Error saving inbound message to DB:', dbErr);
        }
        // 1.5 Fetch Business profile based on the WhatsApp Business Phone ID
        const business = await Business_1.Business.findOne({ waPhoneId: parsedMsg.phoneNumberId });
        const user = business ? await User_1.User.findOne({ clerkId: business.ownerId }) : null;
        let waToken = undefined;
        if (business && user) {
            waToken = business.waToken || undefined;
            const limits = require('../utils/planLimits').getPlanLimits(user.plan || 'starter');
            const limit = limits.aiResponsesPerMonth === Infinity ? Infinity : limits.aiResponsesPerMonth;
            if (user.monthlyAiResponses >= limit) {
                logger_1.default.info(`Rate limit reached for user ${user.clerkId} on plan ${user.plan}`);
                try {
                    await (0, whatsapp_service_1.sendWhatsAppMessage)(parsedMsg.phoneNumberId, parsedMsg.customerPhone, "Our AI agent has reached its monthly response limit. Please upgrade your plan to continue.", waToken);
                }
                catch (err) {
                    logger_1.default.error('Failed to send limit exceeded message', err);
                }
                return;
            }
        }
        // 2. Fetch recent history for context (last 10 messages)
        let history = [];
        try {
            const recentMessages = await Message.find({ customerPhone: parsedMsg.customerPhone })
                .sort({ timestamp: -1 })
                .limit(11) // Get current + 10 previous
                .lean();
            // Reverse to get chronological order and remove current message (it's handled by Gemini as the new prompt)
            const prevMessages = recentMessages.slice(1).reverse();
            history = prevMessages.map(msg => ({
                role: msg.direction === 'inbound' ? 'user' : 'model',
                parts: [{ text: msg.messageText }]
            }));
        }
        catch (histErr) {
            logger_1.default.error('Error fetching chat history:', histErr);
        }
        // 3. Call AI service to generate a response
        const aiReply = await (0, ai_service_1.generateAiResponse)(parsedMsg.messageText, parsedMsg.customerPhone, history, business?.aiConfig?.personality || "You are a helpful WhatsApp AI Agent. Your goal is to assist customers.", business?.aiConfig?.knowledgeBase || "No specific business knowledge provided yet.");
        // 4. Send the reply back via WhatsApp Cloud API
        await (0, whatsapp_service_1.sendWhatsAppMessage)(parsedMsg.phoneNumberId, parsedMsg.customerPhone, aiReply, waToken);
        if (user) {
            // Increment user's AI response usage count
            user.monthlyAiResponses += 1;
            await user.save();
        }
        // 5. Store the outbound message in MongoDB
        try {
            await Message.create({
                customerPhone: parsedMsg.customerPhone,
                messageId: `outbound-${Date.now()}`,
                messageText: aiReply,
                messageType: 'text',
                direction: 'outbound'
            });
            logger_1.default.info('Outbound message saved to database');
        }
        catch (dbErr) {
            logger_1.default.error('Error saving outbound message to DB:', dbErr);
        }
        logger_1.default.info(`Successfully processed message from ${parsedMsg.customerPhone}`);
    }
    catch (error) {
        logger_1.default.error(`Error in processIncomingMessage for ${parsedMsg.customerPhone}:`, error);
    }
};
exports.processIncomingMessage = processIncomingMessage;
