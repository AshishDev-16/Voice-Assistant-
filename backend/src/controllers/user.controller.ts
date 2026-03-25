import { Request, Response } from 'express';
import { User } from '../models/User';
import logger from '../utils/logger';

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
        const { createClerkClient } = require('@clerk/backend');
        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
        const clerkUser = await clerk.users.getUser(clerkId);
        finalPlan = (clerkUser.publicMetadata.plan as string) || 'starter';
      } catch (err) {
        logger.error('Failed to fetch plan from Clerk during user creation:', err);
        finalPlan = 'starter';
      }
    }

    if (user) {
      user.waToken = waToken || user.waToken;
      user.waPhoneId = waPhoneId || user.waPhoneId;
      if (finalPlan) user.plan = finalPlan as 'starter' | 'pro' | 'enterprise';
      user.updatedAt = new Date();
      await user.save();
    } else {
      user = await User.create({
        clerkId,
        waToken,
        waPhoneId,
        plan: (finalPlan as 'starter' | 'pro' | 'enterprise') || 'starter',
      });
    }

    res.status(200).json({ message: 'Credentials saved successfully', user });
  } catch (error) {
    logger.error('Error saving user credentials:', error);
    res.status(500).json({ error: 'Failed to save credentials' });
  }
};
