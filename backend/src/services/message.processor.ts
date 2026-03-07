import { ParsedMessage } from '../types/whatsapp.types';
import logger from '../utils/logger';
import { generateAiResponse } from './ai.service';
import { sendWhatsAppMessage } from './whatsapp.service';
import mongoose from 'mongoose';

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
 * Orchestrates the flow: DB storage -> AI Generation -> Sending Reply
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
      // We choose to proceed even if DB save fails to ensure the user gets a reply
    }

    // 2. Call AI service to generate a response
    const aiReply = await generateAiResponse(parsedMsg.messageText, parsedMsg.customerPhone);

    // 3. Send the reply back via WhatsApp Cloud API
    await sendWhatsAppMessage(parsedMsg.phoneNumberId, parsedMsg.customerPhone, aiReply);

    // 4. Store the outbound message in MongoDB
    try {
      await Message.create({
        customerPhone: parsedMsg.customerPhone,
        messageId: `outbound-${Date.now()}`, // Typically you'd capture the actual ID from the send response
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
