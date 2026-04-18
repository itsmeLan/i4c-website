import mongoose from "mongoose";
import { env } from "./env.js";

let connected = false;

export async function connectDb() {
  if (connected) return;
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 10_000,
  });
  connected = true;
  // eslint-disable-next-line no-console
  console.log("Mongo connected");
}

