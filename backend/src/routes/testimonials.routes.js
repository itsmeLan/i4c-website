import express from "express";
import { z } from "zod";

import { Testimonial } from "../models/Testimonial.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const testimonialsRouter = express.Router();

const testimonialUpsertSchema = z.object({
  name: z.string().min(2).max(120),
  position: z.string().max(120).optional().default(""),
  company: z.string().max(120).optional().default(""),
  rating: z.number().min(1).max(5).optional().default(5),
  content: z.string().min(10).max(5000),
  project: z.string().max(200).optional().default(""),
  imageUrl: z.string().url().optional().or(z.literal("")).default(""),
  order: z.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(true),
});

// Public: list published testimonials
testimonialsRouter.get("/", async (_req, res, next) => {
  try {
    const items = await Testimonial.find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    return res.json({ ok: true, items });
  } catch (err) {
    return next(err);
  }
});

// Admin: create
testimonialsRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const body = testimonialUpsertSchema.parse(req.body);
    const created = await Testimonial.create(body);
    return res.status(201).json({ ok: true, item: created });
  } catch (err) {
    return next(err);
  }
});

// Admin: update
testimonialsRouter.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const body = testimonialUpsertSchema.parse(req.body);
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!updated) {
      const e = new Error("Testimonial not found");
      e.statusCode = 404;
      throw e;
    }
    return res.json({ ok: true, item: updated });
  } catch (err) {
    return next(err);
  }
});

// Admin: delete
testimonialsRouter.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const e = new Error("Testimonial not found");
      e.statusCode = 404;
      throw e;
    }
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

