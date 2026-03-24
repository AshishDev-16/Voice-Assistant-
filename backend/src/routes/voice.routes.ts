import { Router } from 'express';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

const router = Router();

// Twilio calls this when a user dials the phone number
router.post('/incoming', (req, res) => {
  const twiml = new VoiceResponse();
  
  // Connect the call to our WebSocket stream
  const connect = twiml.connect();
  const host = req.headers.host;
  connect.stream({ url: `wss://${host}/api/voice/stream` });

  res.type('text/xml');
  res.send(twiml.toString());
});

export default router;
