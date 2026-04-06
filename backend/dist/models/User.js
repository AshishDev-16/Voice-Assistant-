"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, default: "" },
    name: { type: String, default: "" },
    plan: { type: String, enum: ['starter', 'pro', 'enterprise'], default: 'starter' },
    isOnboarded: { type: Boolean, default: false },
    // Usage tracking stays with User (can be shared across businesses or tied to primary)
    monthlyCallCount: { type: Number, default: 0 },
    monthlyAiResponses: { type: Number, default: 0 },
    usageResetDate: { type: Date, default: () => {
            const d = new Date();
            d.setMonth(d.getMonth() + 1);
            d.setDate(1);
            d.setHours(0, 0, 0, 0);
            return d;
        } },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.User = mongoose_1.default.model('User', userSchema);
