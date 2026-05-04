"use strict";
const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["search", "compare"],
      default: "search",
    },
    query: {
      type: String,
      required: true,
      trim: true,
    },
    // For compare type, store both names
    compareWith: {
      type: String,
      trim: true,
    },
    lang: {
      type: String,
      enum: ["en", "hi"],
      default: "en",
    },
    resultFound: {
      type: Boolean,
      default: true,
    },
    cachedResult: {
      type: Boolean,
      default: false,
    },
    responseTimeMs: Number,
  },
  { timestamps: true }
);

// Index for fast user-history queries (sorted by newest)
searchHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
