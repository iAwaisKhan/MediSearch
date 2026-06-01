import express from "express";
const router   = express.Router();
import * as ctrl from "../controllers/medicineController";
import { optionalAuth  } from "../middleware/authMiddleware";
import { validateMedicineSearch, validateCompare  } from "../middleware/validators";

// optionalAuth: logged-in users get history saved; guests still get results
router.get("/search",  optionalAuth, validateMedicineSearch, ctrl.searchMedicine);
router.get("/compare", optionalAuth, validateCompare,        ctrl.compareMedicines);

export default router;
