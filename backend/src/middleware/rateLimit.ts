import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { getPlanLimits } from '../utils/planLimits';
import logger from '../utils/logger';

/**
 * Middleware to check if the user has exceeded their plan's monthly call limit.
 * Expects `businessId` (clerkId) in req.body or req.query.
 */
export const checkCallLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.body.businessId || req.query.businessId;
    if (!businessId) return next(); // Skip if no businessId

    const user = await User.findOne({ clerkId: businessId });
    if (!user) return res.status(404).json({ error: 'User not found' });

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

    const limits = getPlanLimits(user.plan || 'starter');

    if (user.monthlyCallCount >= limits.callsPerMonth) {
      logger.warn(`User ${businessId} exceeded call limit (${user.monthlyCallCount}/${limits.callsPerMonth})`);
      return res.status(429).json({
        error: 'Monthly call limit reached',
        limit: limits.callsPerMonth,
        used: user.monthlyCallCount,
        plan: user.plan,
      });
    }

    next();
  } catch (error) {
    logger.error('Rate limit check error:', error);
    next(); // Don't block on errors
  }
};

/**
 * Middleware to check AI response limits.
 */
export const checkAiLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.body.businessId || req.query.businessId || req.body.clerkId;
    if (!businessId) return next();

    const user = await User.findOne({ clerkId: businessId });
    if (!user) return next();

    const limits = getPlanLimits(user.plan || 'starter');

    if (user.monthlyAiResponses >= limits.aiResponsesPerMonth) {
      return res.status(429).json({
        error: 'Monthly AI response limit reached',
        limit: limits.aiResponsesPerMonth,
        used: user.monthlyAiResponses,
        plan: user.plan,
      });
    }

    // Increment counter
    await User.findOneAndUpdate(
      { clerkId: businessId },
      { $inc: { monthlyAiResponses: 1 } }
    );

    next();
  } catch (error) {
    logger.error('AI limit check error:', error);
    next();
  }
};

/**
 * Increment monthly call count for a user.
 */
export const incrementCallCount = async (businessId: string) => {
  await User.findOneAndUpdate(
    { clerkId: businessId },
    { $inc: { monthlyCallCount: 1, callCount: 1 } }
  );
};
