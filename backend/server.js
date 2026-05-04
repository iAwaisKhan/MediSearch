"use strict";
require("dotenv").config();
require("./config/envValidator");

const express        = require("express");
const helmet         = require("helmet");
const cors           = require("cors");
const morgan         = require("morgan");
const rateLimit      = require("express-rate-limit");
const mongoSanitize  = require("express-mongo-sanitize");
const compression    = require("compression");
const connectDB      = require("./config/db");
const errorHandler   = require("./middleware/errorHandler");
const logger         = require("./utils/logger");
const AppError       = require("./utils/AppError");

// ── Connect DB ─────────────────────────────────────────────────────────────
connectDB();

const app = express();

// ── Security headers ───────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Sanitise & compress ────────────────────────────────────────────────────
app.use(mongoSanitize());
app.use(compression());

// ── Logging ────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
}

// ── Rate limiting ──────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { status: "fail", message: "Too many auth attempts. Please wait 15 minutes." },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 15,
  message: { status: "fail", message: "Too many AI requests. Please slow down." },
});

app.use("/api/", globalLimiter);
app.use("/api/auth/login",    authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/medicine/",     aiLimiter);

// ── Health check ───────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status:  "ok",
    env:     process.env.NODE_ENV,
    uptime:  Math.floor(process.uptime()),
    ts:      new Date().toISOString(),
  });
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/medicine", require("./routes/medicineRoutes"));
app.use("/api/history",  require("./routes/historyRoutes"));

// ── 404 handler ────────────────────────────────────────────────────────────
app.all("*", (req, _res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, 404));
});

// ── Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received – shutting down gracefully");
  server.close(() => process.exit(0));
});

module.exports = app;
