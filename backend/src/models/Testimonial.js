import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, default: "", trim: true },
    company: { type: String, default: "", trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    content: { type: String, required: true, trim: true },
    project: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

TestimonialSchema.index({ order: 1, createdAt: -1 });

export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);

