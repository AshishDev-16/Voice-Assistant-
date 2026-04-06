"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocket = void 0;
const ws_1 = require("ws");
const logger_1 = __importDefault(require("../utils/logger"));
const CallLog_1 = require("../models/CallLog");
const User_1 = require("../models/User");
const Business_1 = require("../models/Business");
const ai_service_1 = require("./ai.service");
const initializeWebSocket = (server) => {
    const wss = new ws_1.WebSocketServer({ server, path: '/api/voice/stream' });
    wss.on('connection', async (ws, req) => {
        logger_1.default.info('New Twilio Media stream connected.');
        let streamSid = '';
        let callSid = '';
        let callerNumber = '';
        let businessId = '';
        let callLogId = '';
        const transcriptBuffer = [];
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                switch (data.event) {
                    case 'connected':
                        logger_1.default.info('A new call has connected.');
                        break;
                    case 'start':
                        streamSid = data.start.streamSid;
                        callSid = data.start.callSid || '';
                        callerNumber = data.start.customParameters?.From || 'Unknown';
                        businessId = data.start.customParameters?.businessId || '';
                        logger_1.default.info(`Media stream started: ${streamSid} | Caller: ${callerNumber} | Business: ${businessId}`);
                        // Create a new CallLog entry
                        try {
                            const callLog = await CallLog_1.CallLog.create({
                                businessId,
                                callerNumber,
                                twilioCallSid: callSid,
                                streamSid,
                                status: 'in-progress',
                            });
                            callLogId = callLog._id.toString();
                            logger_1.default.info(`CallLog created: ${callLogId}`);
                            // Increment call count for the user's monthly usage
                            await User_1.User.findOneAndUpdate({ clerkId: businessId }, { $inc: { monthlyCallCount: 1 } });
                        }
                        catch (dbErr) {
                            logger_1.default.error('Failed to create CallLog', dbErr);
                        }
                        break;
                    case 'media':
                        // data.media.payload contains Base64 encoded, 8000Hz, mu-law audio chunks
                        // In production, this would be piped to a speech-to-text service (Deepgram/Whisper)
                        // and the transcribed text sent to Gemini for a response
                        // For now, this is a placeholder for the audio processing pipeline
                        break;
                    case 'stop':
                        logger_1.default.info(`Media stream stopped: ${streamSid}`);
                        // Finalize the call log
                        if (callLogId) {
                            try {
                                const business = await Business_1.Business.findOne({ ownerId: businessId });
                                // Advanced Pro-Plan Intelligence
                                const intel = await (0, ai_service_1.generateCallIntelligence)(transcriptBuffer, business?.type || 'general', business?.aiConfig?.extractionSchema || {});
                                await CallLog_1.CallLog.findByIdAndUpdate(callLogId, {
                                    status: 'completed',
                                    transcript: transcriptBuffer,
                                    summary: intel.summary,
                                    outcome: intel.outcome,
                                    sentiment: intel.sentiment || 'neutral',
                                    leadScore: intel.leadScore || 0,
                                    extractedData: intel.extractedData,
                                    recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Mock recording for UI demo
                                    duration: Math.floor((Date.now() - new Date().getTime()) / 1000),
                                    updatedAt: new Date()
                                });
                                logger_1.default.info(`CallLog ${callLogId} finalized with Intelligence Score: ${intel.leadScore}`);
                            }
                            catch (err) {
                                logger_1.default.error('Error finalizing CallLog', err);
                            }
                        }
                        break;
                }
            }
            catch (error) {
                logger_1.default.error('Error handling WebSocket message', error);
            }
        });
        ws.on('close', () => {
            logger_1.default.info('Twilio WebSocket disconnected.');
        });
        ws.on('error', (error) => {
            logger_1.default.error('WebSocket Error:', error);
        });
    });
};
exports.initializeWebSocket = initializeWebSocket;
