import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    features: [{ type: String, trim: true }],
    icon: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ServiceSchema.index({ order: 1, createdAt: -1 });

export const Service = mongoose.model("Service", ServiceSchema);

