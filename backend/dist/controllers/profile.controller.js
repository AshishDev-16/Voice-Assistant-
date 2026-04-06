"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_1 = require("../models/User");
const Business_1 = require("../models/Business");
const backend_1 = require("@clerk/backend");
const logger_1 = __importDefault(require("../utils/logger"));
const clerk = (0, backend_1.createClerkClient)({ secretKey: process.env.CLERK_SECRET_KEY });
const getProfile = async (req, res) => {
    try {
        const { clerkId } = req.query;
        if (!clerkId)
            return res.status(400).json({ error: 'clerkId is required' });
        let user = await User_1.User.findOne({ clerkId });
        if (!user) {
            // If user not in DB, check Clerk metadata to see if they have a plan
            try {
                const clerkUser = await clerk.users.getUser(clerkId);
                const hasPlan = !!clerkUser.publicMetadata.plan;
                if (hasPlan) {
                    // User has paid but not onboarded into DB yet
                    return res.status(200).json({
                        isOnboarded: false,
                        needsInitialization: true
                    });
                }
            }
            catch (err) {
                logger_1.default.error('Failed to resolve ghost user status from Clerk:', err);
            }
            return res.status(404).json({ error: 'User not found' });
        }
        // Sync Plan from Clerk if out of sync
        try {
            const clerkUser = await clerk.users.getUser(clerkId);
            const clerkPlan = clerkUser.publicMetadata.plan || 'starter';
            if (user.plan !== clerkPlan) {
                user.plan = clerkPlan;
                await user.save();
                console.log(`[PROFILE_GET] Synced plan for ${clerkId}: ${clerkPlan}`);
            }
        }
        catch (err) {
            console.error('[PROFILE_GET] Failed to sync plan from Clerk:', err);
        }
        const business = await Business_1.Business.findOne({ ownerId: clerkId });
        return res.status(200).json({
            aiPersonality: business?.aiConfig?.personality || "",
            knowledgeBase: business?.aiConfig?.knowledgeBase || "",
            businessName: business?.name || "",
            businessType: business?.type || "",
            primaryLanguage: business?.aiConfig?.primaryLanguage || "English",
            agentGoal: business?.aiConfig?.agentGoal || "lead_generation",
            agentTone: business?.aiConfig?.agentTone || "professional",
            extractionSchema: business?.aiConfig?.extractionSchema || {},
            businessHours: business?.hours || "",
            isOnboarded: user.isOnboarded,
            twilioPhoneNumber: business?.twilioPhoneNumber || "",
        });
    }
    catch (error) {
        console.error('[PROFILE_GET]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const { clerkId, aiPersonality, knowledgeBase, businessName, businessType, primaryLanguage, agentGoal, agentTone, extractionSchema, businessHours, isOnboarded } = req.body;
        if (!clerkId)
            return res.status(400).json({ error: 'clerkId is required' });
        // Update User model (Onboarding status)
        const user = await User_1.User.findOneAndUpdate({ clerkId }, {
            $set: {
                isOnboarded: isOnboarded !== undefined ? isOnboarded : true,
                updatedAt: new Date()
            }
        }, { new: true, upsert: true });
        // Update Business model (Settings & AI Config)
        const businessUpdate = {};
        if (businessName !== undefined)
            businessUpdate.name = businessName;
        if (businessType !== undefined)
            businessUpdate.type = businessType;
        if (businessHours !== undefined)
            businessUpdate.hours = businessHours;
        // Nest AI Config
        const aiConfig = {};
        if (aiPersonality !== undefined)
            aiConfig.personality = aiPersonality;
        if (knowledgeBase !== undefined)
            aiConfig.knowledgeBase = knowledgeBase;
        if (primaryLanguage !== undefined)
            aiConfig.primaryLanguage = primaryLanguage;
        if (agentGoal !== undefined)
            aiConfig.agentGoal = agentGoal;
        if (agentTone !== undefined)
            aiConfig.agentTone = agentTone;
        if (extractionSchema !== undefined)
            aiConfig.extractionSchema = extractionSchema;
        if (Object.keys(aiConfig).length > 0) {
            businessUpdate.aiConfig = aiConfig;
        }
        businessUpdate.updatedAt = new Date();
        const business = await Business_1.Business.findOneAndUpdate({ ownerId: clerkId }, { $set: businessUpdate }, { new: true, upsert: true });
        // Sync to Clerk publicMetadata so frontend routing works immediately
        if (isOnboarded !== undefined) {
            try {
                await clerk.users.updateUserMetadata(clerkId, {
                    publicMetadata: {
                        isOnboarded: !!isOnboarded
                    }
                });
            }
            catch (clerkError) {
                console.error('[CLERK_METADATA_SYNC_ERROR]', clerkError);
            }
        }
        return res.status(200).json({
            success: true,
            aiPersonality: business?.aiConfig?.personality,
            knowledgeBase: business?.aiConfig?.knowledgeBase,
            businessName: business?.name,
            businessType: business?.type,
            primaryLanguage: business?.aiConfig?.primaryLanguage,
            agentGoal: business?.aiConfig?.agentGoal,
            agentTone: business?.aiConfig?.agentTone,
            extractionSchema: business?.aiConfig?.extractionSchema,
            businessHours: business?.hours,
            isOnboarded: user.isOnboarded,
        });
    }
    catch (error) {
        console.error('[PROFILE_UPDATE]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
