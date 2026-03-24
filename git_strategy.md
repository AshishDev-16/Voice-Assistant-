# Structured Deployment & Git Strategy

To ensure a clean history, we will break down the massive "Voice AI Pivot" into 5 logical phases. Each phase will have its own branch and specific commit scope.

## Phase 1: Obsidian Crimson Design Overhaul
**Branch:** `design/obsidian-crimson`
- All landing page components (`hero`, `features`, `footer`, `how-it-works`, `pricing`, `navbar`)
- [tailwind.config.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/frontend/tailwind.config.ts) (Maroon/Black tokens)
- Root [layout.tsx](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/frontend/app/layout.tsx) and [page.tsx](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/frontend/app/page.tsx)
- **Focus:** Just the look and feel change.

## Phase 2: Telephony & Voice Backend Core
**Branch:** `feature/voice-telephony-core`
- Backend WebSocket server ([server.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/server.ts))
- Call tracking routes ([voice.routes.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/routes/voice.routes.ts), [call.routes.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/routes/call.routes.ts))
- AI Summarization service ([ai.service.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/services/ai.service.ts))
- [CallLog](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/frontend/app/dashboard/calls/page.tsx#10-21) model
- **Focus:** The "plumbing" for handling incoming voice streams.

## Phase 3: Subscription Usage & Rate Limits
**Branch:** `feature/usage-tracking`
- `User` model updates (usage fields)
- [rateLimit.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/middleware/rateLimit.ts) middleware
- [planLimits.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/utils/planLimits.ts) configuration
- Profile controller updates (Business Type/Schema)
- **Focus:** The subscription-based logic for Gemini/Twilio limits.

## Phase 4: Business Onboarding & Configuration
**Branch:** `feature/onboarding-flow`
- `/starter-home` (Onboarding Wizard)
- `/dashboard/knowledge` (Agent Config)
- `/dashboard/settings` (Voice Config)
- **Focus:** The user-friendly setup experience for non-technical business owners.

## Phase 5: Voice Dashboard & Analytics
**Branch:** `feature/voice-dashboard`
- `/dashboard` (Usage bars/recent calls)
- `/dashboard/analytics` (Voice metrics)
- `/dashboard/appointments` (Dynamic record display)
- Updated [dashboard.controller.ts](file:///c:/Users/Ashish/OneDrive/Desktop/WhatsApp%20AI%20Agent/backend/src/controllers/dashboard.controller.ts)
- **Focus:** Finalizing the management interface with real data.

---

### Proposed Workflow
1. **Now:** I will create the First branch (`design/obsidian-crimson`) and commit all UI changes.
2. **Step 2:** I will create the Second branch (`feature/voice-telephony-core`) and commit the backend core.
3. **...and so on.**

> [!NOTE]
> We can do these one after another right now, or I can help you do one or two today and keep the rest for "tomorrow" as requested.
