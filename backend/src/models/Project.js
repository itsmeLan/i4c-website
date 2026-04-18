import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    year: { type: String, default: "", trim: true },
    client: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    status: { type: String, enum: ["Completed", "In Progress"], default: "Completed" },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    coverImageUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ category: 1 });

export const Project = mongoose.model("Project", ProjectSchema);

