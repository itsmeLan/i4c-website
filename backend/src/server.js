import http from "http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./utils/env.js";
import { connectDb } from "./utils/db.js";
import { errorHandler, notFoundHandler } from "./utils/httpErrors.js";
import { bootstrapAdminIfEnabled } from "./utils/bootstrapAdmin.js";
import { requestId } from "./middleware/requestId.js";

import { authRouter } from "./routes/auth.routes.js";
import { inquiriesRouter } from "./routes/inquiries.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { servicesRouter } from "./routes/services.routes.js";
import { testimonialsRouter } from "./routes/testimonials.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
import { estimatorRouter } from "./routes/estimator.js";
import { analyticsRouter } from "./routes/analytics.routes.js";
import { settingsRouter } from "./routes/settings.routes.js";

const app = express();

app.disable("x-powered-by");

// ── 1. Request ID ────────────────────────────────────────────────────────────
// Must be first so every downstream handler has access to req.id.
app.use(requestId);

// ── 2. Security Headers ──────────────────────────────────────────────────────
app.use(helmet());

// ── 3. CORS ──────────────────────────────────────────────────────────────────
// Production: only the exact configured WEB_ORIGIN is allowed.
// Development: allow common local dev ports but NOT open wildcard.
// This prevents any random website from making credentialed requests to the API.
const allowedOrigins = env.NODE_ENV === "production"
  ? (env.WEB_ORIGIN ? [env.WEB_ORIGIN] : [])
  : (env.WEB_ORIGIN
      ? [env.WEB_ORIGIN]
      : ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin header (same-origin, curl, Postman, server-to-server).
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
// ── 4. Global Rate Limiter ──────────────────────────────────────────────────
// Broad safety net: 120 requests / minute for all routes.
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// ── 5. Per-Route Strict Rate Limiters ───────────────────────────────────────
// Auth: 5 login attempts / 15 minutes per IP — prevents brute-force attacks.
const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many login attempts. Please try again in 15 minutes." },
});

// Inquiries: 3 form submissions / 10 minutes per IP — prevents SMTP spam abuse.
const inquiryLimiter = rateLimit({
  windowMs: 10 * 60_000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many submissions. Please wait a few minutes before trying again." },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "i4c-backend", env: env.NODE_ENV });
});

// Apply strict limiters before routers handle the routes.
app.use("/api/auth/login", authLimiter);
app.use("/api/inquiries", (req, res, next) => {
  // Only rate-limit POST (submission); GET (admin list) is unrestricted here.
  if (req.method === "POST") return inquiryLimiter(req, res, next);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/estimator", estimatorRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/settings", settingsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDb();
  await bootstrapAdminIfEnabled();

  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", err);
  process.exitCode = 1;
});

