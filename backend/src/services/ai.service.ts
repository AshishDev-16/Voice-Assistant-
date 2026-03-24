import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import logger from '../utils/logger';

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generates a real AI response using Google Gemini with chat history.
 */
export const generateAiResponse = async (
  userMessage: string, 
  customerPhone: string,
  history: Content[] = [],
  aiPersonality: string = "You are a helpful WhatsApp AI Agent for a modern SaaS company called 'AgentFlow'. Your goal is to assist customers with queries.",
  knowledgeBase: string = ""
): Promise<string> => {
  try {
    logger.info(`Generating Gemini AI response for ${customerPhone}. History length: ${history.length}`);

    if (!process.env.GEMINI_API_KEY) {
      logger.error('GEMINI_API_KEY is missing. Falling back to mock response.');
      return "I'm sorry, my AI brain is currently offline. Please try again later!";
    }

    const systemInstruction = `
      ${aiPersonality}
      
      Here is your business knowledge base. Use this information to answer user queries accurately. If the information is not here, you must politely say you do not know.
      KNOWLEDGE BASE:
      ---
      ${knowledgeBase}
      ---
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return text || "I'm sorry, I couldn't process that. How else can I help you?";
  } catch (error) {
    logger.error('Error generating AI response with Gemini:', error);
    return "I'm having trouble thinking right now. Could you please repeat that?";
  }
};
