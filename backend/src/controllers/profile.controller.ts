import { Request, Response } from 'express';
import { User } from '../models/User';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { clerkId } = req.query;
    if (!clerkId) return res.status(400).json({ error: 'clerkId is required' });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });

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
