"use strict";
const mongoose = require("mongoose");

const genericSchema = new mongoose.Schema(
  {
    name:         String,
    price:        String,
    manufacturer: String,
    savings:      Number,
  },
  { _id: false }
);

const medicineCacheSchema = new mongoose.Schema(
  {
    // Normalised key: lowercase medicine name + language
    cacheKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    medicineName: { type: String, required: true, lowercase: true, trim: true },
    lang:         { type: String, enum: ["en", "hi"], default: "en" },

    // AI response fields
    name:           String,
    genericName:    String,
    category:       String,
    emoji:          String,
    purpose:        String,
    howToTake:      [String],
    dosage:         String,
    suitableFor:    [String],
    notSuitableFor: [String],
    sideEffects:    [String],
    precautions:    [String],
    interactions:   [String],
    storage:        String,
    warning:        String,
    generics:       [genericSchema],

    // Usage stats
    hitCount: { type: Number, default: 1 },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicineCache", medicineCacheSchema);
