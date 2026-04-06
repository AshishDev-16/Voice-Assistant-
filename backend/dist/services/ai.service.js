"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCallIntelligence = exports.generateKnowledgeDraft = exports.generateAiResponse = void 0;
const generative_ai_1 = require("@google/generative-ai");
const logger_1 = __importDefault(require("../utils/logger"));
// Initialize the Gemini SDK
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
/**
 * Generates a real AI response using Google Gemini with chat history.
 */
const generateAiResponse = async (userMessage, customerPhone, history = [], aiPersonality = "You are a helpful WhatsApp AI Agent for a modern SaaS company called 'AgentFlow'. Your goal is to assist customers with queries.", knowledgeBase = "") => {
    try {
        logger_1.default.info(`Generating Gemini AI response for ${customerPhone}. History length: ${history.length}`);
        if (!process.env.GEMINI_API_KEY) {
            logger_1.default.error('GEMINI_API_KEY is missing. Falling back to mock response.');
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
    }
    catch (error) {
        logger_1.default.error('Error generating AI response with Gemini:', error);
        return "I'm having trouble thinking right now. Could you please repeat that?";
    }
};
exports.generateAiResponse = generateAiResponse;
/**
 * Generates a draft knowledge base for a new business during onboarding.
 * Includes a resilient fallback to ensure onboarding is never blocked for the user.
 */
const generateKnowledgeDraft = async (businessName, businessType, agentGoal) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey.includes('your-')) {
            logger_1.default.warn('Valid GEMINI_API_KEY is missing. Using high-quality mock draft.');
            return generateMockDraft(businessName, businessType, agentGoal);
        }
        const client = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });
        const prompt = `
      You are an expert business consultant. Draft a professional, detailed, and comprehensive knowledge base for a new AI Voice Assistant.
      
      Business Details:
      - Name: ${businessName}
      - Type/Industry: ${businessType}
      - Primary Goal of AI: ${agentGoal}

      Write a 3-paragraph knowledge base in first-person (as the business). 
      Include:
      1. What the business does and its unique value proposition.
      2. Specific services or products offered.
      3. How the AI should handle customers to achieve the objective.
      Keep it professional, empathetic, and authoritative.
    `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        logger_1.default.error('Gemini API Error:', error.message);
        // Return a high-quality fallback draft so the user is NOT blocked
        logger_1.default.info('Providing high-quality mock draft fallback.');
        return generateMockDraft(businessName, businessType, agentGoal);
    }
};
exports.generateKnowledgeDraft = generateKnowledgeDraft;
/**
 * Advanced Pro-Plan Call Intelligence: Extracts custom fields, scores leads, and analyzes sentiment.
 */
const generateCallIntelligence = async (transcript, businessType, extractionSchema = {}) => {
    try {
        const transcriptText = transcript.map(t => `${t.role}: ${t.text}`).join('\n');
        const schemaInstructions = Object.keys(extractionSchema).length > 0
            ? `Follow this CUSTOM EXTRACTION SCHEMA specifically: ${JSON.stringify(extractionSchema)}`
            : `Automatically extract relevant details based on the business type: ${businessType}.`;
        const prompt = `
      Analyze this phone call transcript and provide deep business intelligence.
      
      TRANSCRIPT:
      ---
      ${transcriptText}
      ---
      
      TASK:
      1. Provide a concise Executive Summary (2 sentences max).
      2. Identify the Primary Outcome (e.g., "Appointment Booked", "Price Inquiry", etc.).
      3. Determine Sentiment: "positive", "neutral", "negative", or "lead" (use "lead" if they are ready to buy/book).
      4. LEAD SCORE (0-100): Score the caller's conversion probability. 100 is a confirmed sale/booking.
      5. DATA EXTRACTION: ${schemaInstructions}
      
      RETURN ONLY A VALID JSON OBJECT:
      {
        "summary": "...",
        "outcome": "...",
        "sentiment": "...",
        "leadScore": 0-100,
        "extractedData": { ... }
      }
    `;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Failed to parse AI intelligence JSON");
    }
    catch (error) {
        logger_1.default.error('Error in generateCallIntelligence:', error);
        return {
            summary: "AI analysis failed.",
            outcome: "Unknown",
            sentiment: "neutral",
            leadScore: 0,
            extractedData: {}
        };
    }
};
exports.generateCallIntelligence = generateCallIntelligence;
/**
 * High-quality fallback for when the AI is unavailable.
 */
const generateMockDraft = (name, type, goal) => {
    return `At ${name}, we specialize in providing elite ${type} services tailored to the unique needs of our community. Our commitment to excellence and innovation drives everything we do, ensuring that every client receives a personalized experience that exceeds their expectations. Whether you're looking for expert guidance or localized support, our team is dedicated to delivering results with integrity and passion.

We offer a diverse range of specialized solutions, from initial consultations to full-scale enterprise implementations. Our core services are designed to be flexible and scalable, allowing us to serve both individual entrepreneurs and large organizations with equal precision. By focusing on quality over quantity, we ensure that every interaction with ${name} contributes to long-term success and growth for our partners.

As part of our commitment to seamless service, we have integrated an AI Voice Assistant to help us achieve our primary mission: ${goal}. Our assistant is trained to be professional, empathetic, and highly efficient. It works alongside our human team to provide instant answers, handle complex scheduling, and ensure that no customer inquiry goes unanswered. We look forward to showing you how ${name} is redefining the standard in the ${type} industry.`;
};
