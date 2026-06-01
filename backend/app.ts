require("dotenv").config();
require("./config/envValidator");

import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import logger from "./utils/logger";
import AppError from "./utils/AppError";

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

// ── Body parsing & Cookies ──────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser()); // Added cookie-parser

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
app.use("/api/ocr/",          aiLimiter);

// ── Health check ───────────────────────────────────────────────────────────
app.get("/api/health", (_req: any, res: any) => {
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
app.use("/api/ocr",      require("./routes/ocrRoutes"));
app.use("/api/history",  require("./routes/historyRoutes"));

// ── 404 handler ────────────────────────────────────────────────────────────
app.all("*", (req: any, _res: any, next: any) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, 404));
});

// ── Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

export default app;
