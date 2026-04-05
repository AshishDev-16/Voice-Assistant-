import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || '';

async function auditDB() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB via", MONGODB_URI);

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("\n--- COLLECTIONS FOUND ---");
  for (const coll of collections) {
    const count = await mongoose.connection.db.collection(coll.name).countDocuments();
    const firstDoc = await mongoose.connection.db.collection(coll.name).findOne();
    console.log(`Collection: ${coll.name} (${count} docs)`);
    if (firstDoc) {
      console.log(`  Sample (first doc): ${JSON.stringify(firstDoc).substring(0, 500)}...`);
    } else {
      console.log("  (Empty)");
    }
    console.log('---');
  }

  await mongoose.disconnect();
}

auditDB();
