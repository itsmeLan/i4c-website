import bcrypt from "bcryptjs";
import { env } from "./env.js";
import { AdminUser } from "../models/AdminUser.js";

export async function bootstrapAdminIfEnabled() {
  if (!env.ADMIN_BOOTSTRAP_ENABLED) return;

  const admins = [
    { email: env.ADMIN_BOOTSTRAP_EMAIL, password: env.ADMIN_BOOTSTRAP_PASSWORD, name: "Admin" },
    { email: env.ADMIN_BOOTSTRAP_EMAIL_2, password: env.ADMIN_BOOTSTRAP_PASSWORD_2, name: "Super Admin" },
  ];

  for (const { email, password, name } of admins) {
    if (!email || !password) continue;

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

