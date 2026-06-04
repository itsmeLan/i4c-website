import crypto from "crypto";

/**
 * Request ID Middleware
 *
 * Generates a unique UUID (X-Request-ID) for every inbound request and:
 *   1. Attaches it to `req.id` so downstream handlers and error reporters can reference it.
 *   2. Echoes it back in the `X-Request-ID` response header so clients can
 *      quote the ID when reporting bugs or unexpected behaviour.
 *
 * If the caller already supplies an `X-Request-ID` header (e.g. a load-balancer
 * or an upstream proxy), that value is reused to preserve end-to-end trace continuity.
 */
export function requestId(req, res, next) {
  const incoming = req.headers["x-request-id"];
  const id =
    typeof incoming === "string" && incoming.length > 0
      ? incoming
      : crypto.randomUUID();

  req.id = id;
  res.setHeader("X-Request-ID", id);
  next();
}
