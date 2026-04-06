"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Business = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const businessSchema = new mongoose_1.default.Schema({
    ownerId: { type: String, required: true, index: true }, // The Clerk ID of the primary owner
    name: { type: String, default: "" },
    type: { type: String, default: "" }, // e.g. "Healthcare", "Real Estate"
    hours: { type: String, default: "Mon-Fri 9AM-5PM" },
    // AI Agent Settings
    aiConfig: {
        personality: { type: String, default: "Professional, empathetic, and efficient." },
        knowledgeBase: { type: String, default: "" },
        primaryLanguage: { type: String, default: "English" },
        agentGoal: { type: String, default: "appointment" },
        agentTone: { type: String, default: "friendly" },
        extractionSchema: { type: mongoose_1.default.Schema.Types.Mixed, default: {} },
    },
    // External Integration
    twilioPhoneNumber: { type: String, default: "" },
    waToken: { type: String, default: "" },
    waPhoneId: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.Business = mongoose_1.default.model('Business', businessSchema);
