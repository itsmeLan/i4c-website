import express from "express";
import { z } from "zod";
import { Setting } from "../models/Setting.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const settingsRouter = express.Router();

const settingsUpdateSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),
  mapLatitude: z.string().optional(),
  mapLongitude: z.string().optional(),
});

// Public: Get global settings
settingsRouter.get("/", async (req, res, next) => {
  try {
    const doc = await Setting.findOne({ key: "company_info" }).lean();
    return res.json({ ok: true, data: doc?.value || {} });
  } catch (err) {
    return next(err);
  }
});

// Admin: Update global settings
settingsRouter.put("/", requireAdmin, async (req, res, next) => {
  try {
    const value = settingsUpdateSchema.parse(req.body);
    const doc = await Setting.findOneAndUpdate(
      { key: "company_info" },
      { $set: { value } },
      { upsert: true, new: true }
    );
    return res.json({ ok: true, data: doc.value });
  } catch (err) {
    return next(err);
  }
});
