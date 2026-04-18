import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { AdminUser } from "../models/AdminUser.js";
import { signAdminToken } from "../utils/jwt.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
      })
      .parse(req.body);

    const user = await AdminUser.findOne({ email: body.email.toLowerCase() });
    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      return next(err);
    }
    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      return next(err);
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAdminToken(user);
    return res.json({
      ok: true,
      token,
      admin: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
});

