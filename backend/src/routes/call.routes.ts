import { Router, Request, Response } from 'express';
import { CallLog } from '../models/CallLog';
import logger from '../utils/logger';

const router = Router();

// GET /api/calls?businessId=xxx — List all calls for a business
router.get('/', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const calls = await CallLog.find({ businessId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(calls);
  } catch (error) {
    logger.error('Error fetching call logs', error);
    res.status(500).json({ error: 'Failed to fetch call logs' });
  }
});

// GET /api/calls/:id — Get a single call log with full transcript
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const call = await CallLog.findById(req.params.id).lean();
    if (!call) return res.status(404).json({ error: 'Call not found' });
    res.json(call);
  } catch (error) {
    logger.error('Error fetching call log', error);
    res.status(500).json({ error: 'Failed to fetch call log' });
  }
});

// GET /api/calls/stats?businessId=xxx — Dashboard stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ error: 'businessId is required' });

    const totalCalls = await CallLog.countDocuments({ businessId });
    const completedCalls = await CallLog.countDocuments({ businessId, status: 'completed' });
    const missedCalls = await CallLog.countDocuments({ businessId, status: 'missed' });
    const inProgressCalls = await CallLog.countDocuments({ businessId, status: 'in-progress' });

    // Get recent calls for the feed
    const recentCalls = await CallLog.find({ businessId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('callerNumber status outcome duration createdAt')
      .lean();

    res.json({
      totalCalls,
      completedCalls,
      missedCalls,
      inProgressCalls,
      recentCalls,
    });
  } catch (error) {
    logger.error('Error fetching call stats', error);
    res.status(500).json({ error: 'Failed to fetch call stats' });
  }
});

export default router;
