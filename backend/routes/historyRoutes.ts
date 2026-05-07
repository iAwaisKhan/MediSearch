"use strict";
const express  = require("express");
const router   = express.Router();
const ctrl     = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All history routes require auth

router.get("/",        ctrl.getHistory);
router.get("/stats",   ctrl.getStats);
router.delete("/",     ctrl.clearHistory);
router.delete("/:id",  ctrl.deleteHistoryItem);

module.exports = router;

export {};
