import { Request, Response } from 'express';
import { User } from '../models/User';
import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { clerkId } = req.query;
    if (!clerkId) return res.status(400).json({ error: 'clerkId is required' });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Sync Plan from Clerk if out of sync
    try {
      const clerkUser = await clerk.users.getUser(clerkId as string);
      const clerkPlan = (clerkUser.publicMetadata.plan as string) || 'starter';
      if (user.plan !== clerkPlan) {
        user.plan = clerkPlan as 'starter' | 'pro' | 'enterprise';
        await user.save();
        console.log(`[PROFILE_GET] Synced plan for ${clerkId}: ${clerkPlan}`);
      }
    } catch (err) {
      console.error('[PROFILE_GET] Failed to sync plan from Clerk:', err);
    }

    return res.status(200).json({
      aiPersonality: user.aiPersonality,
      knowledgeBase: user.knowledgeBase,
      businessType: user.businessType,
      extractionSchema: user.extractionSchema,
      businessHours: user.businessHours,
      isOnboarded: user.isOnboarded,
      twilioPhoneNumber: user.twilioPhoneNumber,
    });
  } catch (error) {
    console.error('[PROFILE_GET]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { clerkId, aiPersonality, knowledgeBase, businessType, extractionSchema, businessHours, isOnboarded } = req.body;
    if (!clerkId) return res.status(400).json({ error: 'clerkId is required' });

    const updateFields: any = {};
    if (aiPersonality !== undefined) updateFields.aiPersonality = aiPersonality;
    if (knowledgeBase !== undefined) updateFields.knowledgeBase = knowledgeBase;
    if (businessType !== undefined) updateFields.businessType = businessType;
    if (extractionSchema !== undefined) updateFields.extractionSchema = extractionSchema;
    if (businessHours !== undefined) updateFields.businessHours = businessHours;
    if (isOnboarded !== undefined) updateFields.isOnboarded = isOnboarded;

    updateFields.updatedAt = Date.now();

    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    // Sync to Clerk publicMetadata so frontend routing works immediately
    if (isOnboarded !== undefined) {
      try {
        await clerk.users.updateUserMetadata(clerkId, {
          publicMetadata: {
            isOnboarded: !!isOnboarded
          }
        });
      } catch (clerkError) {
        console.error('[CLERK_METADATA_SYNC_ERROR]', clerkError);
      }
    }

    return res.status(200).json({
      success: true,
      aiPersonality: user.aiPersonality,
      knowledgeBase: user.knowledgeBase,
      businessType: user.businessType,
      extractionSchema: user.extractionSchema,
      businessHours: user.businessHours,
      isOnboarded: user.isOnboarded,
    });
  } catch (error) {
    console.error('[PROFILE_UPDATE]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
