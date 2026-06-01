require("dotenv").config();
require("./config/envValidator");

import app from "./app";
import connectDB from "./config/db";
import logger from "./utils/logger";

// ── Connect DB ─────────────────────────────────────────────────────────────
connectDB();

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "5000", 10);
const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on("unhandledRejection", (err: any) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received – shutting down gracefully");
  server.close(() => process.exit(0));
});
