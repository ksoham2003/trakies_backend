import { ApiError } from "../utils/ApiError.js";

/**
 * Global Express error-handling middleware.
 *
 * Must be registered AFTER all routes in app.js so it acts as the
 * last resort for any error passed via next(err) or thrown inside
 * async route handlers when using an async wrapper.
 *
 * Handles:
 *  - Custom ApiError instances (preserves their status code)
 *  - Mongoose CastError (invalid ObjectId → 400)
 *  - Mongoose ValidationError (schema constraint failure → 422)
 *  - JWT errors (invalid/expired token → 401)
 *  - Everything else → 500 Internal Server Error
 *
 * In production (NODE_ENV !== "development") the raw error stack is
 * NOT sent to the client to avoid leaking implementation details.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err?.status || err?.statusCode || 500;
  let message = err?.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // Mongoose schema validation failure
  if (err.name === "ValidationError") {
    statusCode = 422;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(", ");
  }

  // JWT – token malformed or expired
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please log in again.";
  }

  const response = {
    success: false,
    statusCode,
    message,
  };

  // Include stack trace only in development to ease debugging
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export { errorHandler };
