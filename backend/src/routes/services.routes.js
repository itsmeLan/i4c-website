import express from "express";
import { z } from "zod";

import { Service } from "../models/Service.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const servicesRouter = express.Router();

const serviceUpsertSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(5000).optional().default(""),
  features: z.array(z.string().min(1).max(200)).optional().default([]),
  icon: z.string().max(120).optional().default(""),
  order: z.number().int().optional().default(0),
});

// Public: list services
servicesRouter.get("/", async (_req, res, next) => {
  try {
    const items = await Service.find().sort({ order: 1, createdAt: -1 }).lean();
    return res.json({ ok: true, items });
  } catch (err) {
    return next(err);
  }
});

// Admin: create
servicesRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const body = serviceUpsertSchema.parse(req.body);
    const created = await Service.create(body);
    return res.status(201).json({ ok: true, item: created });
  } catch (err) {
    return next(err);
  }
});

// Admin: update
servicesRouter.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const body = serviceUpsertSchema.parse(req.body);
    const updated = await Service.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!updated) {
      const e = new Error("Service not found");
      e.statusCode = 404;
      throw e;
    }
    return res.json({ ok: true, item: updated });
  } catch (err) {
    return next(err);
  }
});

// Admin: delete
servicesRouter.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const e = new Error("Service not found");
      e.statusCode = 404;
      throw e;
    }
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

