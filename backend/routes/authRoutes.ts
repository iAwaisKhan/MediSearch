import express from "express";
const router     = express.Router();
import * as ctrl from "../controllers/authController";
import { protect  } from "../middleware/authMiddleware";
import { validateRegister, validateLogin, validateChangePassword  } from "../middleware/validators";

router.post("/register", validateRegister, ctrl.register);
router.post("/login",    validateLogin,    ctrl.login);
router.post("/logout",                     ctrl.logout);

router.use(protect); // All routes below require auth
router.get("/me",                       ctrl.getMe);
router.patch("/update-profile",         ctrl.updateProfile);
router.patch("/change-password",        validateChangePassword, ctrl.changePassword);

export default router;
