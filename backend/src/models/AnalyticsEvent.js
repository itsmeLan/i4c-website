import mongoose from "mongoose";

const AnalyticsEventSchema = new mongoose.Schema(
  {
    event: { type: String, required: true, index: true },
    path: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Standard index for chronological queries and counting
AnalyticsEventSchema.index({ createdAt: -1 });

// Safety mechanism: Automatically delete analytics events older than 90 days
// This protects the database free tier from filling up indefinitely.
AnalyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const AnalyticsEvent = mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
