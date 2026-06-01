import { body, query, validationResult  } from "express-validator";
import AppError from "../utils/AppError";

// Middleware to check results
const validate = (req: any, _res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map((e) => e.msg).join(". ");
    return next(new AppError(msg, 422));
  }
  next();
};

export const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 60 }).withMessage("Name too long"),
  body("email")
    .trim().normalizeEmail()
    .isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain a number"),
  validate,
];

export const validateLogin = [
  body("email").trim().normalizeEmail().isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

export const validateMedicineSearch = [
  query("name")
    .trim()
    .notEmpty().withMessage("Medicine name is required")
    .isLength({ max: 60 }).withMessage("Medicine name too long (max 60 characters)")
    .matches(/^[a-zA-Z0-9\s\-().,']+$/).withMessage("Medicine name contains invalid characters"),
  query("lang")
    .optional()
    .isIn(["en", "hi"]).withMessage("lang must be 'en' or 'hi'"),
  validate,
];

export const validateCompare = [
  query("a").trim().notEmpty().withMessage("First medicine name is required")
    .isLength({ max: 60 }).withMessage("First medicine name too long (max 60 characters)")
    .matches(/^[a-zA-Z0-9\s\-().,']+$/).withMessage("First medicine name contains invalid characters"),
  query("b").trim().notEmpty().withMessage("Second medicine name is required")
    .isLength({ max: 60 }).withMessage("Second medicine name too long (max 60 characters)")
    .matches(/^[a-zA-Z0-9\s\-().,']+$/).withMessage("Second medicine name contains invalid characters"),
  query("lang").optional().isIn(["en", "hi"]),
  validate,
];

export const validateChangePassword = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("New password must contain an uppercase letter")
    .matches(/[0-9]/).withMessage("New password must contain a number"),
  validate,
];
