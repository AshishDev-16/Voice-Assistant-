# WhatsApp Webhook Processing Module

This is a production-ready Node.js/Express module for handling incoming WhatsApp Cloud API webhooks. It is written in TypeScript and follows clean architecture principles.

## Features
- **Express Webhook Server**: Validates and accepts incoming payloads from WhatsApp Cloud API.
- **Robust Parsing**: Extracts customer phone number, message text, and message type safely.
- **Processing Service**: Stores inbound messages in MongoDB, queries an AI Service, and sends outbound replies.
- **Database Integration**: MongoDB connection via Mongoose.
- **Structured Logging**: Configured via Winston.

## Project Structure
```text
/src
  /controllers     # Webhook controller (validation and payload parsing)
  /services        # WhatsApp API communication, AI mocked service, and orchestrator process
  /routes          # Express routes definitions
  /utils           # Database connection and logger
  /types           # TypeScript interfaces for WhatsApp payloads
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```
Ensure you have a MongoDB instance running locally or put a valid MongoDB Atlas URI in `MONGODB_URI`.

### 3. Running Locally
Run the application in development mode:
```bash
npm run dev
```

To build and run for production:
```bash
npm run build
npm start
```

## Example Webhook Payload
This module expects a standard WhatsApp Cloud API JSON payload. You can test the POST endpoint locally using curl or Postman:

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "100000000000000",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "1234567890",
              "phone_number_id": "112233445566778"
            },
            "contacts": [
              {
                "profile": {
                  "name": "John Doe"
                },
                "wa_id": "19876543210"
              }
            ],
            "messages": [
              {
                "from": "19876543210",
                "id": "wamid.HBgLMTk4NzY1NDMyMTAVAgASGCwy",
                "timestamp": "1698765432",
                "text": {
                  "body": "Hello, I want to know the pricing."
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

Test the local endpoint using `curl`:
```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d @payload.json
```

Test Webhook Verification (GET):
```bash
curl -X GET "http://localhost:3000/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=your_secure_verify_token_here&hub.challenge=1158201444"
```
