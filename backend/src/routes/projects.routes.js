import express from "express";
import { z } from "zod";

import { Project } from "../models/Project.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const projectsRouter = express.Router();

const projectUpsertSchema = z.object({
  title: z.string().min(2).max(200),
  category: z.string().min(2).max(60),
  location: z.string().max(200).optional().default(""),
  year: z.string().max(20).optional().default(""),
  client: z.string().max(120).optional().default(""),
  description: z.string().max(5000).optional().default(""),
  status: z.enum(["Completed", "In Progress"]).optional().default("Completed"),
  coverImageUrl: z.string().optional().or(z.literal("")).default(""),
  images: z
    .array(z.object({ url: z.string(), publicId: z.string().min(1) }))
    .optional()
    .default([]),
});

// Public: list projects (supports optional category filter)
projectsRouter.get("/", async (req, res, next) => {
  try {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const query = category ? { category } : {};
    const items = await Project.find(query).sort({ createdAt: -1 }).lean();
    return res.json({ ok: true, items });
  } catch (err) {
    return next(err);
  }
});

// Admin: create
projectsRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const body = projectUpsertSchema.parse(req.body);
    const created = await Project.create(body);
    return res.status(201).json({ ok: true, item: created });
  } catch (err) {
    return next(err);
  }
});

// Admin: update
projectsRouter.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const body = projectUpsertSchema.parse(req.body);
    const updated = await Project.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!updated) {
      const e = new Error("Project not found");
      e.statusCode = 404;
      throw e;
    }
    return res.json({ ok: true, item: updated });
  } catch (err) {
    return next(err);
  }
});

// Admin: delete
projectsRouter.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const e = new Error("Project not found");
      e.statusCode = 404;
      throw e;
    }
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

