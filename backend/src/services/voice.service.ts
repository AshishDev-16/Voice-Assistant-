import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import logger from '../utils/logger';
import { CallLog } from '../models/CallLog';
import { User } from '../models/User';
import { generateAiResponse } from './ai.service';

export const initializeWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server, path: '/api/voice/stream' });

  wss.on('connection', async (ws: WebSocket, req) => {
    logger.info('New Twilio Media stream connected.');
    let streamSid = '';
    let callSid = '';
    let callerNumber = '';
    let businessId = '';
    let callLogId = '';
    const transcriptBuffer: { role: 'ai' | 'caller'; text: string; timestamp: Date }[] = [];

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.event) {
          case 'connected':
            logger.info('A new call has connected.');
            break;

          case 'start':
            streamSid = data.start.streamSid;
            callSid = data.start.callSid || '';
            callerNumber = data.start.customParameters?.From || 'Unknown';
            businessId = data.start.customParameters?.businessId || '';
            
            logger.info(`Media stream started: ${streamSid} | Caller: ${callerNumber} | Business: ${businessId}`);
            
            // Create a new CallLog entry
            try {
              const callLog = await CallLog.create({
                businessId,
                callerNumber,
                twilioCallSid: callSid,
                streamSid,
                status: 'in-progress',
              });
              callLogId = callLog._id.toString();
              logger.info(`CallLog created: ${callLogId}`);
              
              // Increment call count for the business
              await User.findOneAndUpdate(
                { clerkId: businessId },
                { $inc: { callCount: 1 } }
              );
            } catch (dbErr) {
              logger.error('Failed to create CallLog', dbErr);
            }
            break;

          case 'media':
            // data.media.payload contains Base64 encoded, 8000Hz, mu-law audio chunks
            // In production, this would be piped to a speech-to-text service (Deepgram/Whisper)
            // and the transcribed text sent to Gemini for a response
            // For now, this is a placeholder for the audio processing pipeline
            break;

          case 'stop':
            logger.info(`Media stream stopped: ${streamSid}`);
            
            // Finalize the call log
            if (callLogId) {
              try {
                const user = await User.findOne({ clerkId: businessId });
                const summaryPrompt = `Summarize this phone call transcript concisely. Also extract structured data based on the business type "${user?.businessType || 'general'}".
                
                Categorize the sentiment/result as one of: 'positive', 'neutral', 'negative', or 'lead' (use 'lead' if they provided all contact/booking details or placed an order).
                
Transcript:
${transcriptBuffer.map(t => `${t.role}: ${t.text}`).join('\n')}

Return a JSON object with: { "summary": "...", "outcome": "...", "sentiment": "...", "extractedData": { ... } }`;

                const aiSummaryResponse = await generateAiResponse(summaryPrompt, callerNumber);

                let parsedSummary = { summary: '', outcome: '', sentiment: 'neutral', extractedData: {} };
                try {
                  const jsonMatch = aiSummaryResponse.match(/\{[\s\S]*\}/);
                  if (jsonMatch) {
                    parsedSummary = JSON.parse(jsonMatch[0]);
                  }
                } catch {
                  parsedSummary.summary = aiSummaryResponse;
                }

                await CallLog.findByIdAndUpdate(callLogId, {
                  status: 'completed',
                  transcript: transcriptBuffer,
                  summary: parsedSummary.summary,
                  outcome: parsedSummary.outcome,
                  sentiment: parsedSummary.sentiment || 'neutral',
                  extractedData: parsedSummary.extractedData,
                  recordingUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Mock recording for UI demo
                  duration: Math.floor((Date.now() - new Date().getTime()) / 1000),
                  updatedAt: new Date()
                });
                logger.info(`CallLog ${callLogId} finalized.`);
              } catch (err) {
                logger.error('Error finalizing CallLog', err);
              }
            }
            break;
        }
      } catch (error) {
        logger.error('Error handling WebSocket message', error);
      }
    });

    ws.on('close', () => {
      logger.info('Twilio WebSocket disconnected.');
    });
    
    ws.on('error', (error) => {
      logger.error('WebSocket Error:', error);
    });
  });
};
