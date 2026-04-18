import express from "express";
import { z } from "zod";

import { Inquiry } from "../models/Inquiry.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { sendInquiryNotificationEmail } from "../utils/mailer.js";

export const inquiriesRouter = express.Router();

const inquiryCreateSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(40),
  service: z.string().min(2).max(120),
  message: z.string().min(10).max(5000),
});

// Public: create inquiry ("Get a Quote")
inquiriesRouter.post("/", async (req, res, next) => {
  try {
    const body = inquiryCreateSchema.parse(req.body);
    const created = await Inquiry.create({
      ...body,
      source: "website",
    });
    await sendInquiryNotificationEmail(created);
    return res.status(201).json({ ok: true, inquiryId: created._id.toString() });
  } catch (err) {
    return next(err);
  }
});

// Admin: list inquiries
inquiriesRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const items = await Inquiry.find().sort({ createdAt: -1 }).limit(500).lean();
    return res.json({ ok: true, items });
  } catch (err) {
    return next(err);
  }
});

// Admin: update inquiry status
const inquiryUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "won", "lost"]),
});

inquiriesRouter.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const { status } = inquiryUpdateSchema.parse(req.body);
    const updated = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }
    return res.json({ ok: true, item: updated });
  } catch (err) {
    return next(err);
  }
});
