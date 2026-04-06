"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CallLog_1 = require("../models/CallLog");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
// GET /api/calls?businessId=xxx — List all calls for a business
router.get('/', async (req, res) => {
    try {
        const { businessId } = req.query;
        if (!businessId)
            return res.status(400).json({ error: 'businessId is required' });
        const calls = await CallLog_1.CallLog.find({ businessId })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        res.json(calls);
    }
    catch (error) {
        logger_1.default.error('Error fetching call logs', error);
        res.status(500).json({ error: 'Failed to fetch call logs' });
    }
});
// GET /api/calls/stats?businessId=xxx — Dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const { businessId } = req.query;
        if (!businessId)
            return res.status(400).json({ error: 'businessId is required' });
        const totalCalls = await CallLog_1.CallLog.countDocuments({ businessId });
        const completedCalls = await CallLog_1.CallLog.countDocuments({ businessId, status: 'completed' });
        const missedCalls = await CallLog_1.CallLog.countDocuments({ businessId, status: 'missed' });
        const inProgressCalls = await CallLog_1.CallLog.countDocuments({ businessId, status: 'in-progress' });
        // Get recent calls for the feed
        const recentCalls = await CallLog_1.CallLog.find({ businessId })
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
    }
    catch (error) {
        logger_1.default.error('Error fetching call stats', error);
        res.status(500).json({ error: 'Failed to fetch call stats' });
    }
});
// GET /api/calls/:id — Get a single call log with full transcript
router.get('/:id', async (req, res) => {
    try {
        const call = await CallLog_1.CallLog.findById(req.params.id).lean();
        if (!call)
            return res.status(404).json({ error: 'Call not found' });
        res.json(call);
    }
    catch (error) {
        logger_1.default.error('Error fetching call log', error);
        res.status(500).json({ error: 'Failed to fetch call log' });
    }
});
exports.default = router;
