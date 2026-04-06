"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsage = exports.getIntelligence = exports.getDashboardStats = void 0;
const CallLog_1 = require("../models/CallLog");
const User_1 = require("../models/User");
const planLimits_1 = require("../utils/planLimits");
const backend_1 = require("@clerk/backend");
const logger_1 = __importDefault(require("../utils/logger"));
const clerk = (0, backend_1.createClerkClient)({ secretKey: process.env.CLERK_SECRET_KEY });
/**
 * Dashboard stats — real data from CallLog + User usage
 */
const getDashboardStats = async (req, res) => {
    try {
        const { businessId } = req.query;
        if (!businessId)
            return res.status(400).json({ error: 'businessId is required' });
        let user = await User_1.User.findOne({ clerkId: businessId });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Sync Plan from Clerk if out of sync
        try {
            const clerkUser = await clerk.users.getUser(businessId);
            const clerkPlan = clerkUser.publicMetadata.plan || 'starter';
            logger_1.default.info(`Plan Check for ${businessId}: DB=${user.plan}, Clerk=${clerkPlan}`);
            if (user.plan !== clerkPlan) {
                user.plan = clerkPlan;
                await user.save();
                logger_1.default.info(`Successfully synced MongoDB plan to: ${clerkPlan}`);
            }
        }
        catch (err) {
            logger_1.default.error(`Failed to sync plan from Clerk for ${businessId}:`, err);
        }
        const limits = (0, planLimits_1.getPlanLimits)(user.plan || 'starter');
        // Auto-reset if needed
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
        const totalCalls = await CallLog_1.CallLog.countDocuments({ businessId });
        const completedCalls = await CallLog_1.CallLog.countDocuments({ businessId, status: 'completed' });
        const missedCalls = await CallLog_1.CallLog.countDocuments({ businessId, status: 'missed' });
        const inProgressCalls = await CallLog_1.CallLog.countDocuments({ businessId, status: 'in-progress' });
        // Days until reset
        const resetDate = user.usageResetDate || new Date();
        const daysUntilReset = Math.max(0, Math.ceil((new Date(resetDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        // Recent calls
        const recentCalls = await CallLog_1.CallLog.find({ businessId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('callerNumber status outcome duration createdAt extractedData')
            .lean();
        res.json({
            totalCalls,
            completedCalls,
            missedCalls,
            inProgressCalls,
            recentCalls,
            usage: {
                callsUsed: user.monthlyCallCount || 0,
                callsLimit: limits.callsPerMonth === Infinity ? -1 : limits.callsPerMonth,
                aiResponsesUsed: user.monthlyAiResponses || 0,
                aiResponsesLimit: limits.aiResponsesPerMonth === Infinity ? -1 : limits.aiResponsesPerMonth,
                daysUntilReset,
                resetDate: user.usageResetDate,
                plan: user.plan,
                planLabel: limits.label,
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
exports.getDashboardStats = getDashboardStats;
/**
 * Fetch Intelligence Hub data — CallLogs where extractedData has meaningful fields
 */
const getIntelligence = async (req, res) => {
    try {
        const { businessId } = req.query;
        if (!businessId)
            return res.status(400).json({ error: 'businessId is required' });
        const calls = await CallLog_1.CallLog.find({
            businessId,
            status: 'completed',
            $or: [
                { 'extractedData': { $ne: {} } },
                { 'extractedData': { $exists: true } }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        // Transform into user-friendly intelligence format
        const intelligence = calls
            .filter((call) => call.extractedData && Object.keys(call.extractedData).length > 0)
            .map((call) => ({
            id: call._id,
            callerNumber: call.callerNumber,
            outcome: call.outcome || 'Unknown',
            summary: call.summary || '',
            extractedData: call.extractedData,
            sentiment: call.sentiment,
            leadScore: call.leadScore || 0,
            date: call.createdAt,
            duration: call.duration,
        }));
        res.json(intelligence);
    }
    catch (error) {
        logger_1.default.error('Error fetching intelligence hub data:', error);
        res.status(500).json({ error: 'Failed to fetch intelligence hub data' });
    }
};
exports.getIntelligence = getIntelligence;
/**
 * Get usage data for the user
 */
const getUsage = async (req, res) => {
    try {
        const { businessId } = req.query;
        if (!businessId)
            return res.status(400).json({ error: 'businessId is required' });
        const user = await User_1.User.findOne({ clerkId: businessId });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const limits = (0, planLimits_1.getPlanLimits)(user.plan || 'starter');
        const now = new Date();
        const daysUntilReset = Math.max(0, Math.ceil((new Date(user.usageResetDate || now).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        res.json({
            plan: user.plan,
            planLabel: limits.label,
            planPrice: limits.price,
            callsUsed: user.monthlyCallCount || 0,
            callsLimit: limits.callsPerMonth === Infinity ? -1 : limits.callsPerMonth,
            aiResponsesUsed: user.monthlyAiResponses || 0,
            aiResponsesLimit: limits.aiResponsesPerMonth === Infinity ? -1 : limits.aiResponsesPerMonth,
            phoneNumbersLimit: limits.phoneNumbers === Infinity ? -1 : limits.phoneNumbers,
            extractionFieldsLimit: limits.extractionFields === Infinity ? -1 : limits.extractionFields,
            daysUntilReset,
            resetDate: user.usageResetDate,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching usage:', error);
        res.status(500).json({ error: 'Failed to fetch usage' });
    }
};
exports.getUsage = getUsage;
