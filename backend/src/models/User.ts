import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  waToken: { type: String, required: false },
  waPhoneId: { type: String, required: false },
  plan: { type: String, enum: ['starter', 'pro', 'enterprise'], default: 'starter' },
  messageCount: { type: Number, default: 0 },
  aiPersonality: { type: String, default: "" },
  knowledgeBase: { type: String, default: "" },
  // Voice Agent Fields
  twilioPhoneNumber: { type: String, default: "" },
  businessType: { type: String, default: "" }, // e.g. "dentist", "grocery", "restaurant"
  extractionSchema: { type: mongoose.Schema.Types.Mixed, default: {} }, // Dynamic JSON blueprint for structured data extraction
  callCount: { type: Number, default: 0 },
  businessHours: { type: String, default: "" }, // e.g. "Mon-Fri 9AM-5PM"
  isOnboarded: { type: Boolean, default: false },
  // Monthly usage tracking
  monthlyCallCount: { type: Number, default: 0 },
  monthlyAiResponses: { type: Number, default: 0 },
  usageResetDate: { type: Date, default: () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
