import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    // There isn't a direct listModels in the simple SDK usually, 
    // but we can try to get a model and see if it fails immediately in a different way.
    console.log("Checking key:", process.env.GEMINI_API_KEY?.substring(0, 5) + "...");
    
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.0-pro"];
    
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("test");
        console.log(`✅ Model ${m} is accessible.`);
        return m;
      } catch (e: any) {
        console.log(`❌ Model ${m} failed:`, e.message);
      }
    }
  } catch (err) {
    console.error("Fatal error:", err);
  }
}

listModels();
