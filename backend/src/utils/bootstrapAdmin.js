import bcrypt from "bcryptjs";
import { env } from "./env.js";
import { AdminUser } from "../models/AdminUser.js";

// Passwords that come directly from .env.example / documentation samples.
const KNOWN_WEAK_DEFAULTS = new Set([
  "changeme",
  "admin",
  "password",
  "admin123",
  "supersecret",
  "secret",
  "123456",
]);

export async function bootstrapAdminIfEnabled() {
  if (!env.ADMIN_BOOTSTRAP_ENABLED) return;

  // ── Production Guard ──────────────────────────────────────────────────────
  // Bootstrap must never run on a live server. If someone accidentally sets
  // ADMIN_BOOTSTRAP_ENABLED=true in a production environment, abort startup
  // loudly so the misconfiguration cannot be silently exploited.
  if (env.NODE_ENV === "production") {
    throw new Error(
      "[SECURITY] ADMIN_BOOTSTRAP_ENABLED is set to true in a production environment. " +
        "Disable it (ADMIN_BOOTSTRAP_ENABLED=false) before deploying."
    );
  }

  const admins = [
    { email: env.ADMIN_BOOTSTRAP_EMAIL, password: env.ADMIN_BOOTSTRAP_PASSWORD, name: "Admin" },
    { email: env.ADMIN_BOOTSTRAP_EMAIL_2, password: env.ADMIN_BOOTSTRAP_PASSWORD_2, name: "Super Admin" },
  ];

  for (const { email, password, name } of admins) {
    if (!email || !password) continue;

    // ── Weak Password Warning (dev only) ─────────────────────────────────────
    if (KNOWN_WEAK_DEFAULTS.has(password.toLowerCase())) {
      // eslint-disable-next-line no-console
      console.warn(
        `[SECURITY WARNING] Bootstrap password for ${email} matches a known weak default. ` +
          "Update ADMIN_BOOTSTRAP_PASSWORD in backend/.env before exposing this server."
      );
    }

    const existing = await AdminUser.findOne({ email }).lean();
    if (existing) continue;

    const passwordHash = await bcrypt.hash(password, 12);
    await AdminUser.create({
      email,
      passwordHash,
      name,
      role: "admin",
    });
    // eslint-disable-next-line no-console
    console.log("Bootstrapped admin user:", email);
  }
}


