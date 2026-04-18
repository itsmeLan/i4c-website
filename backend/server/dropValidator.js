/**
 * One-time script: removes the $jsonSchema validator from the adminusers
 * collection so that Mongoose can manage the schema instead.
 *
 * Usage:  node --env-file=.env server/dropValidator.js
 *   or:   node server/dropValidator.js   (if dotenv loads via env.js)
 */
import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is not set");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  // List current collections
  const collections = await db.listCollections().toArray();
  const adminCol = collections.find(
    (c) => c.name === "adminusers"
  );

  if (!adminCol) {
    console.log("No 'adminusers' collection found — nothing to do.");
  } else {
    console.log("Current validator:", JSON.stringify(adminCol.options?.validator, null, 2));

    // Remove the validator by setting it to an empty object
    await db.command({
      collMod: "adminusers",
      validator: {},
      validationLevel: "off",
    });
    console.log("✅ Validator removed from 'adminusers' collection.");
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
