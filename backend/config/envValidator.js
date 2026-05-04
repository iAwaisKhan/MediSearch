"use strict";
const { z } = require("zod");
const logger = require("../utils/logger");

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default("7d"),
  JWT_COOKIE_EXPIRE: z.string().default("7"),
  GEMINI_API_KEY: z.string().optional(),
  LLM7_API_KEY: z.string().optional(),
  CLIENT_URL: z.string().url(),
  CACHE_TTL_SECONDS: z.string().default("3600"),
});

try {
  envSchema.parse(process.env);
  logger.info("Environment variables validated successfully.");
} catch (error) {
  logger.error("Environment validation failed:");
  error.errors.forEach((err) => {
    logger.error(`- ${err.path.join(".")}: ${err.message}`);
  });
  process.exit(1);
}

module.exports = envSchema;
