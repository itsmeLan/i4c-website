import mongoose from "mongoose";

const AnalyticsEventSchema = new mongoose.Schema(
  {
    event: { type: String, required: true, index: true },
    path: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { 
    timestamps: true,
    // Safety mechanism: Capped collection limited to 200MB.
    // This is a "set it and forget it" limit that ensures the collection never 
    // grows beyond 200MB, automatically overwriting the oldest data.
    capped: { size: 200 * 1024 * 1024 } 
  }
);

// Standard index for chronological queries and counting
AnalyticsEventSchema.index({ createdAt: -1 });

export const AnalyticsEvent = mongoose.model("AnalyticsEvent", AnalyticsEventSchema);

