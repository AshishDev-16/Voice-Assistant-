"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.completeOnboarding = exports.getIndustryTemplate = exports.generateKnowledgeDraft = exports.saveCredentials = void 0;
const User_1 = require("../models/User");
const Business_1 = require("../models/Business");
const logger_1 = __importDefault(require("../utils/logger"));
const backend_1 = require("@clerk/backend");
const AiService = __importStar(require("../services/ai.service"));
const template_service_1 = require("../services/template.service");
const clerk = (0, backend_1.createClerkClient)({ secretKey: process.env.CLERK_SECRET_KEY });
const saveCredentials = async (req, res) => {
    try {
        const { clerkId, waToken, waPhoneId, plan } = req.body;
        if (!clerkId) {
            return res.status(400).json({ error: 'clerkId is required' });
        }
        let user = await User_1.User.findOne({ clerkId });
        // Fetch plan from Clerk if not provided
        let finalPlan = plan;
        if (!finalPlan) {
            try {
                const clerkUser = await clerk.users.getUser(clerkId);
                finalPlan = clerkUser.publicMetadata.plan || 'starter';
            }
            catch (err) {
                logger_1.default.error('Failed to fetch plan from Clerk during user creation:', err);
                finalPlan = 'starter';
            }
        }
        if (user) {
            if (finalPlan)
                user.plan = finalPlan;
            user.updatedAt = new Date();
            await user.save();
        }
        else {
            user = await User_1.User.create({
                clerkId,
                plan: finalPlan || 'starter',
            });
        }
        // Sync WhatsApp credentials to Business record
        await Business_1.Business.findOneAndUpdate({ ownerId: clerkId }, {
            waToken,
            waPhoneId,
            updatedAt: new Date()
        }, { upsert: true, new: true });
        res.status(200).json({ message: 'Credentials saved successfully', user });
    }
    catch (error) {
        logger_1.default.error('Error saving user credentials:', error);
        res.status(500).json({ error: 'Failed to save credentials' });
    }
};
exports.saveCredentials = saveCredentials;
const generateKnowledgeDraft = async (req, res) => {
    try {
        const { businessName, businessType, agentGoal } = req.body;
        if (!businessName || !businessType) {
            return res.status(400).json({ error: 'Business name and type are required' });
        }
        const draft = await AiService.generateKnowledgeDraft(businessName, businessType, agentGoal || "General Q&A");
        res.status(200).json({ draft });
    }
    catch (error) {
        logger_1.default.error('Error generating AI knowledge draft:', error);
        res.status(500).json({ error: 'Failed to generate AI draft' });
    }
};
exports.generateKnowledgeDraft = generateKnowledgeDraft;
const getIndustryTemplate = async (req, res) => {
    try {
        const { industry } = req.query;
        if (!industry || typeof industry !== 'string') {
            return res.status(400).json({ error: 'Industry query parameter is required' });
        }
        const template = template_service_1.TemplateService.getTemplate(industry);
        res.status(200).json(template);
    }
    catch (error) {
        logger_1.default.error('Error fetching industry template:', error);
        res.status(500).json({ error: 'Failed to fetch industry template' });
    }
};
exports.getIndustryTemplate = getIndustryTemplate;
const completeOnboarding = async (req, res) => {
    try {
        const { clerkId, businessName, businessType, otherBusinessType, businessHours, aiPersonality, knowledgeBase, primaryLanguage, agentGoal, agentTone } = req.body;
        if (!clerkId) {
            return res.status(400).json({ error: 'clerkId is required' });
        }
        let user = await User_1.User.findOne({ clerkId });
        // If user doesn't exist (e.g. after a Hard Reset), create them here
        if (!user) {
            logger_1.default.info(`User ${clerkId} not found in DB during onboarding. Creating new record.`);
            // Fetch plan from Clerk for the new record
            let plan = 'starter';
            try {
                const clerkUser = await clerk.users.getUser(clerkId);
                plan = clerkUser.publicMetadata.plan || 'starter';
            }
            catch (err) {
                logger_1.default.error('Failed to fetch plan from Clerk during onboarding upsert:', err);
            }
            user = new User_1.User({
                clerkId,
                plan,
                isOnboarded: false
            });
        }
        // Update business details in dedicated Business model
        const business = await Business_1.Business.findOneAndUpdate({ ownerId: clerkId }, {
            name: businessName,
            type: businessType || otherBusinessType,
            hours: businessHours,
            aiConfig: {
                personality: aiPersonality,
                knowledgeBase,
                primaryLanguage,
                agentGoal,
                agentTone
            },
            updatedAt: new Date()
        }, { upsert: true, new: true });
        // If Twilio number is missing, simulate allocation
        if (!business.twilioPhoneNumber) {
            const mockNumber = `+91 ${Math.floor(Math.random() * 3) + 7}${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
            business.twilioPhoneNumber = mockNumber;
            await business.save();
        }
        user.isOnboarded = true;
        user.updatedAt = new Date();
        await user.save();
        // Sync to Clerk publicMetadata
        try {
            await clerk.users.updateUserMetadata(clerkId, {
                publicMetadata: {
                    isOnboarded: true
                }
            });
        }
        catch (clerkErr) {
            logger_1.default.error('Failed to sync isOnboarded status to Clerk:', clerkErr);
        }
        logger_1.default.info(`Onboarding completed for user ${clerkId}. Tone: ${agentTone}, Goal: ${agentGoal}`);
        res.status(200).json({ message: 'Onboarding completed successfully', user, business });
    }
    catch (error) {
        logger_1.default.error('Error during onboarding:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.completeOnboarding = completeOnboarding;
const deleteUser = async (req, res) => {
    try {
        const { clerkId } = req.query;
        if (!clerkId) {
            return res.status(400).json({ error: 'clerkId is required' });
        }
        // 1. Delete from MongoDB (User, Business, CallLogs)
        await User_1.User.deleteOne({ clerkId });
        await Business_1.Business.deleteOne({ ownerId: clerkId });
        // Note: CallLogs use businessId, which is currently the clerkId
        const { CallLog } = require('../models/CallLog');
        await CallLog.deleteMany({ businessId: clerkId });
        logger_1.default.info(`Deleted all records for user ${clerkId} from MongoDB`);
        // 2. Hard Reset: Delete the user from Clerk entirely
        try {
            await clerk.users.deleteUser(clerkId);
            logger_1.default.info(`Permanently deleted user ${clerkId} from Clerk (Hard Reset)`);
        }
        catch (clerkErr) {
            logger_1.default.error(`Failed to delete user ${clerkId} from Clerk:`, clerkErr);
            return res.status(500).json({ error: 'Failed to purge Clerk account. Please contact support.' });
        }
        res.status(200).json({ message: 'Account and Organization permanently deleted.' });
    }
    catch (error) {
        logger_1.default.error('Error during Hard Reset:', error);
        res.status(500).json({ error: 'Failed to complete Hard Reset' });
    }
};
exports.deleteUser = deleteUser;
