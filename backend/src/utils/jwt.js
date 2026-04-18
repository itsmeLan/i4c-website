import jwt from "jsonwebtoken";
import { env } from "./env.js";

export function signAdminToken(adminUser) {
  return jwt.sign(
    { sub: adminUser._id.toString(), role: adminUser.role, email: adminUser.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

