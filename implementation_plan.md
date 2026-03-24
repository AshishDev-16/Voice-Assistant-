# Architectural Pivot: Voice Call Assistance SaaS

## 1. Goal Description

The platform is completing a massive pivot from a **WhatsApp Text Assistant** to a **Real-Time AI Voice Agent**. Instead of consumers texting a business, they will dial a phone number. The AI will instantly pick up the call, converse naturally (using voice), and extract structured outcomes like "Orders Placed" or "Appointments Booked." 

This pivot demands a transition at the infrastructure level (telephony over webhooks), database level (call logs over message chat history), and a complete **Maroon/Black/White Glassmorphism** aesthetic redesign.

## User Review Required
> [!IMPORTANT]
> **Voice Provider Selection:** Building a low-latency voice agent from scratch using just STT/TTS models is tough. I strongly recommend pairing **Twilio** (to buy and route actual phone numbers) with **OpenAI's Realtime WebSocket API** or **Vapi.ai** to handle the ultra-fast voice generation. This plan assumes we will build a dedicated WebSockets stream server in your backend. Does this sound correct?
>
> **Call Extraction:** The AI will generate a structured JSON object at the end of the call (e.g., an appointment or order). We will build a new dashboard page for businesses to define what "Fields" the AI must collect. 

---

## 2. Updated Database & Core Features

### Phase 1: Database Redesign (MongoDB)
- **`CallLog` Collection:** We need to drop the old [Message](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/services/whatsapp.service.ts#4-41) chat schema and implement a `CallLog`.
  - Schema: `businessId`, `callerNumber`, `duration`, `recordingUrl`, `transcript` (Array of objects), `summary` (String), `extractedData` (Map/JSON), `status` (e.g., "Order Placed", "Failed").
- **`User` (Business Profile) Upgrade:**
  - Add `twilioPhoneNumber` or `agentPhoneNumberId`.
  - Add `extractionSchema`: A dynamically defined JSON blueprint so the business can tell the AI exactly what variables to collect during the conversation.

### Phase 2: Telephony Backend Server 
- **WebSocket Streaming ([backend/src/server.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/server.ts)):** We must implement a secure WebSocket server that fields inbound Twilio Media Streams.
- **Voice Engine (`voice.service.ts`):** 
  - Authenticates the inbound Twilio call against the business's `User` ID in the database.
  - Injects the business's `aiPersonality` and `knowledgeBase` into the system prompt.
  - Streams audio back and forth to the NLP Voice Model to ensure sub-second conversational latency.
- **Post-Call Webhook ([webhook.controller.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/controllers/webhook.controller.ts)):** Once a call hangs up, summarize the transcript using Gemini and dump the structured `extractedData` into the database.

---

## 3. The "Maroon Glass" Redesign (Frontend)

The entire frontend (Landing Page + Starter/Pro Dashboards) will be reskinned according to the new visual aesthetic: **Maroon, Black, White Glassmorphism, with Scroll Animations**.

### Landing Page
- Retain the existing **3D Animation Hero Section**.
- Replace Emerald/Cyberpunk tones with a deep, luxurious palette.
  - Backgrounds: Very dark grays/pure black (`#050505`).
  - Accents: Deep Maroon (`#880808` to `#4A0404`), glowing via absolute positioned blur circles.
  - Cards: High-opacity glass (`bg-white/5` with sharp white borders `border-white/10`).
- Implement smooth `framer-motion` or standard Tailwind Intersection Observer scroll animations so elements fade-and-slide up as the user scrolls down.

### Dashboard Overhaul
- **Sidebar & Topbar:** Shift to the new Maroon/Black Glass aesthetic.
- **Conversations -> Call Inbox:** Rebuild the inbox to look like an email/call client. Clicking a call log will slide out a drawer containing:
  - An Audio Player to listen to the call.
  - A scrollable Call Transcript.
  - A visual "Extraction Report" showing the structured data the AI pulled (e.g., "Customer Name: John, Procedure: Teeth Whitening, Date: Tuesday 4PM").
- **Knowledge Base -> Agent Configuration:** Retain the persona inputs, but add sliders for "Voice Select" (Male/Female, Accent) if supported by our provider.
- **Call Setup (Starter Dashboard):** A simple setup screen explaining how to forward their business phone to our Twilio number.

## 4. Verification Plan
- **Verification of 2nd User:** The 2nd Clerk Dummy User has been artificially upgraded to the `starter` tier in Clerk allowing you to immediately view the Starter Dashboard logic.
- **Audio Routing:** Once the backend WebSockets are written, we will use a local test script or ngrok to proxy a mock phone call directly to the Node.js server.
