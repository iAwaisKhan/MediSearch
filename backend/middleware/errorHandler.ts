import AppError from "../utils/AppError";
import logger from "../utils/logger";

function handleCastError(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}
function handleDuplicateKey(err) {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists. Please use a different value.`, 400);
}
function handleValidationError(err: any) {
  const messages = Object.values(err.errors).map((e: any) => e.message).join(". ");
  return new AppError(messages, 400);
}
function handleJWTError() {
  return new AppError("Invalid token. Please log in again.", 401);
}
function handleJWTExpired() {
  return new AppError("Session expired. Please log in again.", 401);
}

export default (err: any, req: any, res: any, next: any) => {
  err.statusCode = err.statusCode || 500;
  err.status     = err.status     || "error";

  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err, { message: err.message });

  if (err.name === "CastError")              error = handleCastError(err);
  if (err.code  === 11000)                   error = handleDuplicateKey(err);
  if (err.name === "ValidationError")        error = handleValidationError(err);
  if (err.name === "JsonWebTokenError")      error = handleJWTError();
  if (err.name === "TokenExpiredError")      error = handleJWTExpired();

  // Log server errors
  if (error.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} – ${err.stack || err.message}`);
  }

  // In production, don't leak unknown error details
  if (process.env.NODE_ENV === "production" && !error.isOperational) {
    return res.status(500).json({ status: "error", message: "Something went wrong." });
  }

  res.status(error.statusCode).json({
    status:  error.status,
    message: error.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
