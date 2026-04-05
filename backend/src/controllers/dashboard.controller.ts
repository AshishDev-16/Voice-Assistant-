import { Request, Response } from 'express';
import { CallLog } from '../models/CallLog';
import { User } from '../models/User';
import { getPlanLimits } from '../utils/planLimits';
import { createClerkClient } from '@clerk/backend';
import logger from '../utils/logger';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * Dashboard stats — real data from CallLog + User usage
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    let user = await User.findOne({ clerkId: businessId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Sync Plan from Clerk if out of sync
    try {
      const clerkUser = await clerk.users.getUser(businessId as string);
      const clerkPlan = (clerkUser.publicMetadata.plan as string) || 'starter';
      logger.info(`Plan Check for ${businessId}: DB=${user.plan}, Clerk=${clerkPlan}`);
      if (user.plan !== clerkPlan) {
        user.plan = clerkPlan as 'starter' | 'pro' | 'enterprise';
        await user.save();
        logger.info(`Successfully synced MongoDB plan to: ${clerkPlan}`);
      }
    } catch (err) {
      logger.error(`Failed to sync plan from Clerk for ${businessId}:`, err);
    }

    const limits = getPlanLimits(user.plan || 'starter');

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

    const totalCalls = await CallLog.countDocuments({ businessId });
    const completedCalls = await CallLog.countDocuments({ businessId, status: 'completed' });
    const missedCalls = await CallLog.countDocuments({ businessId, status: 'missed' });
    const inProgressCalls = await CallLog.countDocuments({ businessId, status: 'in-progress' });

    // Days until reset
    const resetDate = user.usageResetDate || new Date();
    const daysUntilReset = Math.max(0, Math.ceil((new Date(resetDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // Recent calls
    const recentCalls = await CallLog.find({ businessId })
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
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

/**
 * Fetch Intelligence Hub data — CallLogs where extractedData has meaningful fields
 */
export const getIntelligence = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const calls = await CallLog.find({
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
      .filter((call: any) => call.extractedData && Object.keys(call.extractedData).length > 0)
      .map((call: any) => ({
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
  } catch (error) {
    logger.error('Error fetching intelligence hub data:', error);
    res.status(500).json({ error: 'Failed to fetch intelligence hub data' });
  }
};

/**
 * Get usage data for the user
 */
export const getUsage = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const user = await User.findOne({ clerkId: businessId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const limits = getPlanLimits(user.plan || 'starter');
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
  } catch (error) {
    logger.error('Error fetching usage:', error);
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
};
