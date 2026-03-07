import logger from '../utils/logger';

/**
 * Mocked AI service.
 * In a real application, this would call OpenAI API to generate a reply.
 */
export const generateAiResponse = async (userMessage: string, customerPhone: string): Promise<string> => {
  logger.info(`Generating AI response for message: "${userMessage}"`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Basic mocked response logic based on keywords
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
    return 'Our basic plan starts at $29/month. You can find more details on our pricing page!';
  } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return 'Hello! How can I assist you with our WhatsApp automation tools today?';
  } else if (lowerMsg.includes('order')) {
    return 'I can help you with your order. Could you please provide your order ID?';
  } else {
    return `Thank you for your message: "${userMessage}". Our team or AI will assist you shortly.`;
  }
};
