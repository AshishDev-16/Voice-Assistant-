import { Request, Response } from 'express';
import { User } from '../models/User';
import { Business } from '../models/Business';
import logger from '../utils/logger';
import { createClerkClient } from '@clerk/backend';
import * as AiService from '../services/ai.service';
import { TemplateService } from '../services/template.service';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const saveCredentials = async (req: Request, res: Response) => {
  try {
    const { clerkId, waToken, waPhoneId, plan } = req.body;

    if (!clerkId) {
      return res.status(400).json({ error: 'clerkId is required' });
    }

    let user = await User.findOne({ clerkId });

    // Fetch plan from Clerk if not provided
    let finalPlan = plan;
    if (!finalPlan) {
      try {
        const clerkUser = await clerk.users.getUser(clerkId);
        finalPlan = (clerkUser.publicMetadata.plan as string) || 'starter';
      } catch (err) {
        logger.error('Failed to fetch plan from Clerk during user creation:', err);
        finalPlan = 'starter';
      }
    }

    if (user) {
      if (finalPlan) user.plan = finalPlan as 'starter' | 'pro' | 'enterprise';
      user.updatedAt = new Date();
      await user.save();
    } else {
      user = await User.create({
        clerkId,
        plan: (finalPlan as 'starter' | 'pro' | 'enterprise') || 'starter',
      });
    }

    // Sync WhatsApp credentials to Business record
    await Business.findOneAndUpdate(
      { ownerId: clerkId },
      { 
        waToken, 
        waPhoneId,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Credentials saved successfully', user });
  } catch (error) {
    logger.error('Error saving user credentials:', error);
    res.status(500).json({ error: 'Failed to save credentials' });
  }
};

export const generateKnowledgeDraft = async (req: Request, res: Response) => {
  try {
    const { businessName, businessType, agentGoal } = req.body;
    if (!businessName || !businessType) {
      return res.status(400).json({ error: 'Business name and type are required' });
    }

    const draft = await AiService.generateKnowledgeDraft(businessName, businessType, agentGoal || "General Q&A");
    res.status(200).json({ draft });
  } catch (error) {
    logger.error('Error generating AI knowledge draft:', error);
    res.status(500).json({ error: 'Failed to generate AI draft' });
  }
};

export const getIndustryTemplate = async (req: Request, res: Response) => {
  try {
    const { industry } = req.query;
    if (!industry || typeof industry !== 'string') {
      return res.status(400).json({ error: 'Industry query parameter is required' });
    }

    const template = TemplateService.getTemplate(industry);
    res.status(200).json(template);
  } catch (error) {
    logger.error('Error fetching industry template:', error);
    res.status(500).json({ error: 'Failed to fetch industry template' });
  }
};

export const completeOnboarding = async (req: Request, res: Response) => {
  try {
    const { 
      clerkId, 
      businessName, 
      businessType, 
      otherBusinessType,
      businessHours, 
      aiPersonality, 
      knowledgeBase,
      primaryLanguage,
      agentGoal,
      agentTone
    } = req.body;

    if (!clerkId) {
      return res.status(400).json({ error: 'clerkId is required' });
    }

    let user = await User.findOne({ clerkId });

    // If user doesn't exist (e.g. after a Hard Reset), create them here
    if (!user) {
      logger.info(`User ${clerkId} not found in DB during onboarding. Creating new record.`);
      
      // Fetch plan from Clerk for the new record
      let plan: 'starter' | 'pro' | 'enterprise' = 'starter';
      try {
        const clerkUser = await clerk.users.getUser(clerkId);
        plan = (clerkUser.publicMetadata.plan as 'starter' | 'pro' | 'enterprise') || 'starter';
      } catch (err) {
        logger.error('Failed to fetch plan from Clerk during onboarding upsert:', err);
      }

      user = new User({
        clerkId,
        plan,
        isOnboarded: false
      });
    }

    // Update business details in dedicated Business model
    const business = await Business.findOneAndUpdate(
      { ownerId: clerkId },
      {
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
      },
      { upsert: true, new: true }
    );

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
    } catch (clerkErr) {
      logger.error('Failed to sync isOnboarded status to Clerk:', clerkErr);
    }

    logger.info(`Onboarding completed for user ${clerkId}. Tone: ${agentTone}, Goal: ${agentGoal}`);
    res.status(200).json({ message: 'Onboarding completed successfully', user, business });
  } catch (error) {
    logger.error('Error during onboarding:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { clerkId } = req.query;

    if (!clerkId) {
      return res.status(400).json({ error: 'clerkId is required' });
    }

    // 1. Delete from MongoDB (User, Business, CallLogs)
    await User.deleteOne({ clerkId });
    await Business.deleteOne({ ownerId: clerkId });
    // Note: CallLogs use businessId, which is currently the clerkId
    const { CallLog } = require('../models/CallLog');
    await CallLog.deleteMany({ businessId: clerkId });
    
    logger.info(`Deleted all records for user ${clerkId} from MongoDB`);

    // 2. Hard Reset: Delete the user from Clerk entirely
    try {
      await clerk.users.deleteUser(clerkId as string);
      logger.info(`Permanently deleted user ${clerkId} from Clerk (Hard Reset)`);
    } catch (clerkErr) {
      logger.error(`Failed to delete user ${clerkId} from Clerk:`, clerkErr);
      return res.status(500).json({ error: 'Failed to purge Clerk account. Please contact support.' });
    }

    res.status(200).json({ message: 'Account and Organization permanently deleted.' });
  } catch (error) {
    logger.error('Error during Hard Reset:', error);
    res.status(500).json({ error: 'Failed to complete Hard Reset' });
  }
};
