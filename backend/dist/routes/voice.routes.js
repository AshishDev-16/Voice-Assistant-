"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VoiceResponse_1 = __importDefault(require("twilio/lib/twiml/VoiceResponse"));
const router = (0, express_1.Router)();
// Twilio calls this when a user dials the phone number
router.post('/incoming', (req, res) => {
    const twiml = new VoiceResponse_1.default();
    // Connect the call to our WebSocket stream
    const connect = twiml.connect();
    const host = req.headers.host;
    connect.stream({ url: `wss://${host}/api/voice/stream` });
    res.type('text/xml');
    res.send(twiml.toString());
});
exports.default = router;
