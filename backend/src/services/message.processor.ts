import { ParsedMessage } from '../types/whatsapp.types';
import logger from '../utils/logger';
import { generateAiResponse } from './ai.service';
import { sendWhatsAppMessage } from './whatsapp.service';
import mongoose from 'mongoose';
import { Content } from '@google/generative-ai';
import { User } from '../models/User';
import { Business } from '../models/Business';

// Simple Mongoose schema for storing Conversation data
const messageSchema = new mongoose.Schema({
  customerPhone: { type: String, required: true },
  messageId: { type: String, required: true, unique: true },
  messageText: { type: String, required: true },
  messageType: { type: String, required: true },
  direction: { type: String, enum: ['inbound', 'outbound'], required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

/**
 * Orchestrates the flow: DB storage -> History Retrieval -> AI Generation -> Sending Reply
 */
export const processIncomingMessage = async (parsedMsg: ParsedMessage): Promise<void> => {
  try {
    logger.info(`Starting processing for message from ${parsedMsg.customerPhone}`);

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
      logger.info('Inbound message saved to database');
    } catch (dbErr) {
      logger.error('Error saving inbound message to DB:', dbErr);
    }

    // 1.5 Fetch Business profile based on the WhatsApp Business Phone ID
    const business = await Business.findOne({ waPhoneId: parsedMsg.phoneNumberId });
    const user = business ? await User.findOne({ clerkId: business.ownerId }) : null;
    let waToken: string | undefined = undefined;

    if (business && user) {
      waToken = business.waToken || undefined;
      const limits = require('../utils/planLimits').getPlanLimits(user.plan || 'starter');
      const limit = limits.aiResponsesPerMonth === Infinity ? Infinity : limits.aiResponsesPerMonth;
      
      if (user.monthlyAiResponses >= limit) {
        logger.info(`Rate limit reached for user ${user.clerkId} on plan ${user.plan}`);
        try {
          await sendWhatsAppMessage(
            parsedMsg.phoneNumberId,
            parsedMsg.customerPhone,
            "Our AI agent has reached its monthly response limit. Please upgrade your plan to continue.",
            waToken
          );
        } catch (err) {
          logger.error('Failed to send limit exceeded message', err);
        }
        return;
      }
    }

    // 2. Fetch recent history for context (last 10 messages)
    let history: Content[] = [];
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
    } catch (histErr) {
      logger.error('Error fetching chat history:', histErr);
    }

    // 3. Call AI service to generate a response
    const aiReply = await generateAiResponse(
      parsedMsg.messageText, 
      parsedMsg.customerPhone, 
      history,
      business?.aiConfig?.personality || "You are a helpful WhatsApp AI Agent. Your goal is to assist customers.",
      business?.aiConfig?.knowledgeBase || "No specific business knowledge provided yet."
    );

    // 4. Send the reply back via WhatsApp Cloud API
    await sendWhatsAppMessage(parsedMsg.phoneNumberId, parsedMsg.customerPhone, aiReply, waToken);

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
      logger.info('Outbound message saved to database');
    } catch (dbErr) {
      logger.error('Error saving outbound message to DB:', dbErr);
    }

    logger.info(`Successfully processed message from ${parsedMsg.customerPhone}`);
  } catch (error) {
    logger.error(`Error in processIncomingMessage for ${parsedMsg.customerPhone}:`, error);
  }
};
