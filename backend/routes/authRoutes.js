"use strict";
const express    = require("express");
const router     = express.Router();
const ctrl       = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validateRegister, validateLogin } = require("../middleware/validators");

router.post("/register", validateRegister, ctrl.register);
router.post("/login",    validateLogin,    ctrl.login);
router.post("/logout",                     ctrl.logout);

router.use(protect); // All routes below require auth
router.get("/me",                       ctrl.getMe);
router.patch("/update-profile",         ctrl.updateProfile);
router.patch("/change-password",        ctrl.changePassword);

module.exports = router;
