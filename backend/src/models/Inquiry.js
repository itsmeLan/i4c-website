import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    source: { type: String, default: "website" },
    status: { type: String, enum: ["new", "contacted", "won", "lost"], default: "new" },
  },
  { timestamps: true },
);

InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ email: 1, createdAt: -1 });

export const Inquiry = mongoose.model("Inquiry", InquirySchema);

