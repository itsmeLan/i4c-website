import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
    role: { type: String, enum: ["admin"], default: "admin" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export const AdminUser = mongoose.model("AdminUser", AdminUserSchema);

