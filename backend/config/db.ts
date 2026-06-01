"use strict";
import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err: any) {
    logger.warn(`MongoDB connection failed: ${err.message}. Running without DB...`);
    mongoose.set("bufferCommands", false);
    // process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
mongoose.connection.on("reconnected",  () => logger.info("MongoDB reconnected"));

export default connectDB;

export {};
