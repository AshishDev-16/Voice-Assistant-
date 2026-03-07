import { Request, Response } from 'express';
import logger from '../utils/logger';
import { processIncomingMessage } from '../services/message.processor';
import { ParsedMessage, WhatsAppWebhookBody } from '../types/whatsapp.types';

/**
 * Handles the webhook verification request from WhatsApp Cloud API.
 */
export const verifyWebhook = (req: Request, res: Response): void => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      logger.info('Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      logger.warn('Webhook verification failed: Invalid token');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
};

/**
 * Handles incoming webhook events (e.g., messages) from WhatsApp.
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const body: WhatsAppWebhookBody = req.body;

    // Check if it's from the WhatsApp API
    if (body.object === 'whatsapp_business_account') {
      if (body.entry && body.entry.length > 0) {
        for (const entry of body.entry) {
          const changes = entry.changes;
          
          if (!changes || changes.length === 0) continue;
          
          for (const change of changes) {
            const value = change.value;
            
            // Proceed only if there's a message
            if (value.messages && value.messages.length > 0) {
              const message = value.messages[0];
              const contact = value.contacts?.[0];
              const metadata = value.metadata;
              
              // Only process text messages in this basic example
              if (message.type === 'text' && message.text) {
                const parsedMsg: ParsedMessage = {
                  phoneNumberId: metadata.phone_number_id,
                  customerPhone: message.from,
                  customerName: contact?.profile?.name,
                  messageId: message.id,
                  messageText: message.text.body,
                  messageType: message.type,
                  timestamp: message.timestamp
                };

                logger.info(`Received ${message.type} message from ${parsedMsg.customerPhone}`);
                
                // Pass the extracted message to the orchestrator/processor service asynchronously
                // We don't await because WhatsApp requires a 200 OK immediately
                processIncomingMessage(parsedMsg).catch(err => {
                  logger.error('Error processing incoming message in background:', err);
                });
              } else {
                logger.info(`Received unhandled message type: ${message.type}`);
              }
            }
          }
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    logger.error('Error handling webhook payload:', error);
    res.sendStatus(500);
  }
};
