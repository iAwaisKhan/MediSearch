import express from "express";
const router   = express.Router();
import * as ctrl from "../controllers/historyController";
import { protect  } from "../middleware/authMiddleware";

router.use(protect); // All history routes require auth

router.get("/",        ctrl.getHistory);
router.get("/stats",   ctrl.getStats);
router.delete("/",     ctrl.clearHistory);
router.delete("/:id",  ctrl.deleteHistoryItem);

export default router;
