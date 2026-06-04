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

// Allowed image MIME types.
const ALLOWED_MIMETYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/**
 * Validates the first bytes of the file buffer against known image magic bytes.
 * This prevents MIME-type spoofing — attackers uploading a .php/.js disguised
 * as an image by only changing the Content-Type header.
 * @param {Buffer} buffer
 * @returns {boolean}
 */
function isImageByMagicBytes(buffer) {
  if (!buffer || buffer.length < 4) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;
  // GIF: 47 49 46 38
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return true;
  // WEBP: starts with RIFF (52 49 46 46) and has WEBP at bytes 8-11
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer.length >= 12 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) return true;
  return false;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    // First gate: check declared MIME type against the allowlist.
    if (!ALLOWED_MIMETYPES.has(file.mimetype)) {
      return cb(Object.assign(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed."), { statusCode: 415 }));
    }
    cb(null, true);
  },
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

    // Second gate: verify magic bytes regardless of the declared Content-Type.
    // This catches MIME-spoofing attacks where the header is faked to bypass fileFilter.
    if (!isImageByMagicBytes(req.file.buffer)) {
      const e = new Error("Uploaded file does not appear to be a valid image.");
      e.statusCode = 415;
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

