import axios from 'axios';
import logger from '../utils/logger';

/**
 * Service to interact with the WhatsApp Cloud API.
 */
export const sendWhatsAppMessage = async (phoneNumberId: string, to: string, text: string): Promise<void> => {
  try {
    const token = process.env.WHATSAPP_API_TOKEN;
    if (!token) {
      throw new Error('WHATSAPP_API_TOKEN is not configured');
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

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    logger.info(`Message sent to ${to} successfully. Message ID: ${response.data.messages[0].id}`);
  } catch (error: any) {
    logger.error(`Failed to send WhatsApp message to ${to}:`, error.response?.data || error.message);
    throw error;
  }
};
