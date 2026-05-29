"use strict";
const express = require("express");
const multer  = require("multer");
const router  = express.Router();
const ctrl    = require("../controllers/ocrController");
const { optionalAuth } = require("../middleware/authMiddleware");

// ── Multer config: memory storage, 5 MB limit, images only ──────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP) are allowed."), false);
    }
  },
});

// POST /api/ocr/extract
router.post(
  "/extract",
  optionalAuth,
  upload.single("image"),
  ctrl.extractMedicineFromImage
);

// Handle multer errors gracefully
router.use((err, _req, res, _next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      status: "fail",
      message: "Image too large. Maximum size is 5 MB.",
    });
  }
  if (err.message?.includes("Only image files")) {
    return res.status(422).json({
      status: "fail",
      message: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: err.message || "File upload failed.",
  });
});

module.exports = router;

export {};
