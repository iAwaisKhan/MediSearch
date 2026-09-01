"use strict";
import { z  } from "zod";
import logger from "../utils/logger";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default("7d"),
  JWT_COOKIE_EXPIRE: z.string().default("7"),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  GEMINI_API_KEY: z.string().optional(),
  LLM7_API_KEY: z.string().optional(),
  CLIENT_URL: z.string().url(),
  CACHE_TTL_SECONDS: z.string().default("86400"),
});

try {
  envSchema.parse(process.env);
  logger.info("Environment variables validated successfully.");
} catch (error: any) {
  logger.error("Environment validation failed:");
  error.errors?.forEach((err: any) => {
    logger.error(`- ${err.path.join(".")}: ${err.message}`);
  });
  process.exit(1);
}

export default envSchema;
