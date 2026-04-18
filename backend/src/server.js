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
app.use(helmet());
app.use(
  cors({
    origin: env.WEB_ORIGIN ? [env.WEB_ORIGIN] : true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "i4c-backend", env: env.NODE_ENV });
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

