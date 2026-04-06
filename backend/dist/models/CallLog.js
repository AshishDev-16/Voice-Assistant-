"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transcriptEntrySchema = new mongoose_1.default.Schema({
    role: { type: String, enum: ['ai', 'caller'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });
const callLogSchema = new mongoose_1.default.Schema({
    businessId: { type: String, required: true, index: true }, // clerkId of the business owner
    callerNumber: { type: String, required: true },
    duration: { type: Number, default: 0 }, // seconds
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'failed', 'missed'],
        default: 'in-progress'
    },
    transcript: [transcriptEntrySchema],
    summary: { type: String, default: "" },
    extractedData: { type: mongoose_1.default.Schema.Types.Mixed, default: {} }, // Structured output from the call
    outcome: { type: String, default: "" }, // e.g. "Appointment Booked", "Order Placed", "Inquiry"
    twilioCallSid: { type: String, default: "" },
    streamSid: { type: String, default: "" },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative', 'lead'], default: 'neutral' },
    leadScore: { type: Number, default: 0 }, // 0-100 score for Pro Plan lead qualification
    recordingUrl: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.CallLog = mongoose_1.default.model('CallLog', callLogSchema);
