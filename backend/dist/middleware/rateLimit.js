"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementCallCount = exports.checkAiLimit = exports.checkCallLimit = void 0;
const User_1 = require("../models/User");
const planLimits_1 = require("../utils/planLimits");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Middleware to check if the user has exceeded their plan's monthly call limit.
 * Expects `businessId` (clerkId) in req.body or req.query.
 */
const checkCallLimit = async (req, res, next) => {
    try {
        const businessId = req.body.businessId || req.query.businessId;
        if (!businessId)
            return next(); // Skip if no businessId
        const user = await User_1.User.findOne({ clerkId: businessId });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Auto-reset monthly counters if past reset date
        const now = new Date();
        if (user.usageResetDate && now >= user.usageResetDate) {
            user.monthlyCallCount = 0;
            user.monthlyAiResponses = 0;
            const nextReset = new Date();
            nextReset.setMonth(nextReset.getMonth() + 1);
            nextReset.setDate(1);
            nextReset.setHours(0, 0, 0, 0);
            user.usageResetDate = nextReset;
            await user.save();
        }
        const limits = (0, planLimits_1.getPlanLimits)(user.plan || 'starter');
        if (user.monthlyCallCount >= limits.callsPerMonth) {
            logger_1.default.warn(`User ${businessId} exceeded call limit (${user.monthlyCallCount}/${limits.callsPerMonth})`);
            return res.status(429).json({
                error: 'Monthly call limit reached',
                limit: limits.callsPerMonth,
                used: user.monthlyCallCount,
                plan: user.plan,
            });
        }
        next();
    }
    catch (error) {
        logger_1.default.error('Rate limit check error:', error);
        next(); // Don't block on errors
    }
};
exports.checkCallLimit = checkCallLimit;
/**
 * Middleware to check AI response limits.
 */
const checkAiLimit = async (req, res, next) => {
    try {
        const businessId = req.body.businessId || req.query.businessId || req.body.clerkId;
        if (!businessId)
            return next();
        const user = await User_1.User.findOne({ clerkId: businessId });
        if (!user)
            return next();
        const limits = (0, planLimits_1.getPlanLimits)(user.plan || 'starter');
        if (user.monthlyAiResponses >= limits.aiResponsesPerMonth) {
            return res.status(429).json({
                error: 'Monthly AI response limit reached',
                limit: limits.aiResponsesPerMonth,
                used: user.monthlyAiResponses,
                plan: user.plan,
            });
        }
        // Increment counter
        await User_1.User.findOneAndUpdate({ clerkId: businessId }, { $inc: { monthlyAiResponses: 1 } });
        next();
    }
    catch (error) {
        logger_1.default.error('AI limit check error:', error);
        next();
    }
};
exports.checkAiLimit = checkAiLimit;
/**
 * Increment monthly call count for a user.
 */
const incrementCallCount = async (businessId) => {
    await User_1.User.findOneAndUpdate({ clerkId: businessId }, { $inc: { monthlyCallCount: 1, callCount: 1 } });
};
exports.incrementCallCount = incrementCallCount;
