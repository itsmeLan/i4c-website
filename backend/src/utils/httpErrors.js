import { ZodError } from "zod";

export function notFoundHandler(_req, _res, next) {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  // Surface validation failures as 400 instead of generic 500.
  if (err instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      error: "Validation failed",
      details: err.flatten(),
    });
  }

  const status = typeof err.statusCode === "number" ? err.statusCode : 500;
  const message = status === 500 ? "Internal Server Error" : err.message;

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error("Unhandled server error:", err);
  }

  res.status(status).json({
    ok: false,
    error: message,
  });
}

