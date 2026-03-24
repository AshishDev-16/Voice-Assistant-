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

    if (user) {
      user.waToken = waToken || user.waToken;
      user.waPhoneId = waPhoneId || user.waPhoneId;
      if (plan) user.plan = plan;
      user.updatedAt = new Date();
      await user.save();
    } else {
      user = await User.create({
        clerkId,
        waToken,
        waPhoneId,
        plan: plan || 'starter',
      });
    }

    res.status(200).json({ message: 'Credentials saved successfully', user });
  } catch (error) {
    logger.error('Error saving user credentials:', error);
    res.status(500).json({ error: 'Failed to save credentials' });
  }
};
