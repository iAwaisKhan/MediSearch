import express from "express";
import multer from "multer";
const router  = express.Router();
import * as ctrl from "../controllers/ocrController";
import { optionalAuth  } from "../middleware/authMiddleware";

// ── Multer config: memory storage, 5 MB limit, images only ──────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, WebP) are allowed.") as any, false);
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
router.use((err: any, _req: any, res: any, _next: any) => {
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

export default router;
