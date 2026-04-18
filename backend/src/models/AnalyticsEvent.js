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

export const AnalyticsEvent = mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
