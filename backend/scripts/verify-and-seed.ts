import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { CallLog } from '../src/models/CallLog';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "";
const CLERK_ID = "user_3BwfxH8dYCeTE5ixgbSMytQLnHV"; // The user we are testing with

async function seed() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");

    console.log("--- VERIFYING PROFESSIONAL SCHEMA ---");

    const user = await db.collection('users').findOne({ clerkId: CLERK_ID });
    console.log(user ? `✅ User found: ${user.clerkId} (Onboarded: ${user.isOnboarded})` : "❌ User NOT found");

    const business = await db.collection('businesses').findOne({ ownerId: CLERK_ID });
    console.log(business ? `✅ Business found: ${business.name} (Type: ${business.type})` : "❌ Business NOT found");

    console.log("\n--- CLEANING UP OLD CALL LOGS ---");
    await db.collection('calllogs').deleteMany({ businessId: CLERK_ID });
    console.log("✅ Cleared legacy call logs for this user.");

    console.log("\n--- SEEDING FRESH DUMMY DATA ---");
    const mockLogs = [
      {
        businessId: CLERK_ID,
        callerNumber: "+1-555-0101",
        duration: 145,
        status: 'completed',
        summary: "Patient called to book a root canal for next Tuesday. They seemed nervous but confirmed the 3:00 PM slot.",
        outcome: "Appointment Booked",
        sentiment: "positive",
        leadScore: 95,
        extractedData: {
          "Patient Name": "John Doe",
          "Procedure": "Root Canal",
          "Preferred Date": "2026-04-08",
          "Time": "3:00 PM"
        },
        transcript: [
          { role: 'ai', text: "Hello! Ashish Dental Clinic, how can I help you today?" },
          { role: 'caller', text: "Hi, I need to book a root canal. I've been having some pain." },
          { role: 'ai', text: "I'm sorry to hear that. We have an opening next Tuesday at 3:00 PM. Does that work?" },
          { role: 'caller', text: "Yes, that works perfectly. My name is John Doe." }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        updatedAt: new Date()
      },
      {
        businessId: CLERK_ID,
        callerNumber: "+1-555-0202",
        duration: 95,
        status: 'completed',
        summary: "Customer inquiring about iPhone 15 Pro Max stock and black color availability. High intent.",
        outcome: "Product Inquiry",
        sentiment: "lead",
        leadScore: 88,
        extractedData: {
          "Customer Name": "Sarah Smith",
          "Product": "iPhone 15 Pro Max",
          "Color": "Space Black",
          "Urgency": "High"
        },
        transcript: [
          { role: 'ai', text: "Welcome to TechStore AI. What are you looking for?" },
          { role: 'caller', text: "Do you have the iPhone 15 Pro Max in black?" },
          { role: 'ai', text: "Yes, we have 2 units left in Space Black. Would you like me to reserve one?" },
          { role: 'caller', text: "Yes, please! I'm Sarah Smith." }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        updatedAt: new Date()
      },
      {
        businessId: CLERK_ID,
        callerNumber: "+1-555-0303",
        duration: 210,
        status: 'completed',
        summary: "Potential buyer for the Oak Ridge listing. Looking for a 4-bedroom with a pool. Budget around 1.2M.",
        outcome: "View Request",
        sentiment: "lead",
        leadScore: 75,
        extractedData: {
          "Lead Name": "Michael Brown",
          "Property": "Oak Ridge Estate",
          "Budget": "$1.2M",
          "Key Features": ["Pool", "4 Bedrooms", "Suburban"]
        },
        transcript: [
          { role: 'ai', text: "Horizon Realty, this is your AI assistant. How can I help?" },
          { role: 'caller', text: "I saw the Oak Ridge listing. Does it have a pool?" },
          { role: 'ai', text: "It does! A heated saltwater pool. It's a 4-bedroom home." },
          { role: 'caller', text: "Great. My budget is around 1.2 million. Can I see it Saturday?" }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
        updatedAt: new Date()
      }
    ];

    await CallLog.insertMany(mockLogs);
    console.log(`✅ Seeded ${mockLogs.length} complex intelligence records.`);

    console.log("\n--- FINAL DB AUDIT ---");
    const collectionNames = ['businesses', 'calllogs', 'users'];
    for (const coll of collectionNames) {
      const count = await db.collection(coll).countDocuments();
      console.log(`Collection: ${coll} (${count} docs)`);
    }

    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
