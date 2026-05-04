"use strict";
const express  = require("express");
const router   = express.Router();
const ctrl     = require("../controllers/medicineController");
const { optionalAuth } = require("../middleware/authMiddleware");
const { validateMedicineSearch, validateCompare } = require("../middleware/validators");

// optionalAuth: logged-in users get history saved; guests still get results
router.get("/search",  optionalAuth, validateMedicineSearch, ctrl.searchMedicine);
router.get("/compare", optionalAuth, validateCompare,        ctrl.compareMedicines);

module.exports = router;
