import express from "express";
import multer from "multer";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

import { requireAdmin } from "../middleware/requireAdmin.js";
import { configureCloudinary, cloudinary, isCloudinaryConfigured } from "../utils/cloudinary.js";
import { env } from "../utils/env.js";

export const uploadRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

function uploadBufferToCloudinary(buffer, options) {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
    stream.end(buffer);
  });
}

function guessExt(mimetype) {
  if (mimetype === "image/jpeg") return "jpg";
  if (mimetype === "image/png") return "png";
  if (mimetype === "image/webp") return "webp";
  if (mimetype === "image/gif") return "gif";
  return "bin";
}

// Admin: upload a single image to Cloudinary
uploadRouter.post("/image", requireAdmin, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      const e = new Error("No file uploaded");
      e.statusCode = 400;
      throw e;
    }

    // Primary: Cloudinary
    if (isCloudinaryConfigured()) {
      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "i4c/projects",
        resource_type: "image",
      });
      return res.status(201).json({
        ok: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    }

    // Dev fallback: local storage (so feature works immediately)
    if (env.NODE_ENV !== "production") {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const uploadsDir = path.resolve(__dirname, "../../uploads");
      await mkdir(uploadsDir, { recursive: true });

      const ext = guessExt(req.file.mimetype);
      const filename = `${crypto.randomUUID()}.${ext}`;
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, req.file.buffer);

      return res.status(201).json({
        ok: true,
        url: `/uploads/${filename}`,
        publicId: `local:${filename}`,
        width: null,
        height: null,
        format: ext,
        warning: "Cloudinary is not configured. Stored locally for development.",
      });
    }

    const e = new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env",
    );
    e.statusCode = 503;
    throw e;
  } catch (err) {
    return next(err);
  }
});

