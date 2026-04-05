import mongoose from 'mongoose';
import 'dotenv/config';

// Define temporary schemas for migration
const legacyUserSchema = new mongoose.Schema({}, { strict: false, collection: 'Users' });
const UserSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const BusinessSchema = new mongoose.Schema({}, { strict: false, collection: 'businesses' });
const CallLogSchema = new mongoose.Schema({}, { strict: false, collection: 'calllogs' });

const MONGODB_URI = process.env.MONGODB_URI || '';
const TARGET_CLERK_ID = 'user_3BwfxH8dYCeTE5ixgbSMytQLnHV';

async function migrate() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log("Connected to MongoDB for professional migration.");

  const legacyUser = await db.collection('Users').findOne({ clerkId: TARGET_CLERK_ID });
  if (!legacyUser) {
    console.error("Could not find source user in 'Users' collection.");
    // Try lowercase 'users' just in case
    const altUser = await db.collection('users').findOne({ clerkId: TARGET_CLERK_ID });
    if (!altUser) {
        console.error("Target user not found in any collection. Aborting.");
        process.exit(1);
    }
  }

  const sourceData = legacyUser || (await db.collection('users').findOne({ clerkId: TARGET_CLERK_ID }));

  console.log("Found source data. Creating Business record...");

  const businessResult = await db.collection('businesses').insertOne({
    ownerId: TARGET_CLERK_ID,
    name: sourceData.businessName || "Ashish Dental Clinic",
    type: sourceData.businessType || "Healthcare",
    hours: sourceData.businessHours || "Mon-Fri 9AM-5PM",
    aiConfig: {
      personality: sourceData.aiPersonality || "Professional, empathetic, and efficient.",
      knowledgeBase: sourceData.knowledgeBase || "",
      primaryLanguage: sourceData.primaryLanguage || "English",
      agentGoal: sourceData.agentGoal || "appointment",
      agentTone: sourceData.agentTone || "friendly",
      extractionSchema: sourceData.extractionSchema || {},
    },
    twilioPhoneNumber: sourceData.twilioPhoneNumber || "",
    waToken: sourceData.waToken || "",
    waPhoneId: sourceData.waPhoneId || "",
    createdAt: sourceData.createdAt || new Date(),
    updatedAt: new Date()
  });

  const businessId = businessResult.insertedId;
  console.log(`✅ Business created with ID: ${businessId}`);

  console.log("Cleaning up User record...");
  await db.collection('users').updateOne(
    { clerkId: TARGET_CLERK_ID },
    { 
      $set: { 
        isOnboarded: true,
        plan: sourceData.plan || 'pro',
        updatedAt: new Date()
      },
      $unset: {
        businessName: 1,
        businessType: 1,
        businessHours: 1,
        aiPersonality: 1,
        knowledgeBase: 1,
        primaryLanguage: 1,
        agentGoal: 1,
        agentTone: 1,
        extractionSchema: 1,
        twilioPhoneNumber: 1,
        waToken: 1,
        waPhoneId: 1,
        callCount: 1,
        messageCount: 1,
        otherBusinessType: 1
      }
    },
    { upsert: true }
  );

  console.log("Fixing truncated CallLogs...");
  // TRUNCATED: user_3BwfxH8dYCeTE5ixgbSMytQ
  // FULL: user_3BwfxH8dYCeTE5ixgbSMytQLnHV
  const truncatedId = 'user_3BwfxH8dYCeTE5ixgbSMytQ';
  const callUpdate = await db.collection('calllogs').updateMany(
    { businessId: truncatedId },
    { $set: { businessId: TARGET_CLERK_ID } }
  );
  console.log(`✅ Updated ${callUpdate.modifiedCount} truncated call logs.`);

  console.log("Dropping messy collections...");
  const collectionsToDrop = ['Users', 'users_backup', 'test', 'temp']; 
  for (const coll of collectionsToDrop) {
    const exists = await db.listCollections({ name: coll }).hasNext();
    if (exists) {
      await db.dropCollection(coll);
      console.log(`🗑️ Dropped legacy collection: ${coll}`);
    }
  }

  console.log("\n--- MIGRATION COMPLETE ---");
  console.log("The database is now in a professional state.");
  
  await mongoose.disconnect();
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
