import { verifyToken } from "../utils/jwt.js";

export function requireAdmin(req, _res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }
  try {
    const payload = verifyToken(token);
    if (payload.role !== "admin") {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      return next(err);
    }
    req.admin = payload;
    return next();
  } catch {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }
}

