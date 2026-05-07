"use strict";
const { body, query, validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

// Middleware to check results
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map((e) => e.msg).join(". ");
    return next(new AppError(msg, 422));
  }
  next();
};

exports.validateRegister = [
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

exports.validateLogin = [
  body("email").trim().normalizeEmail().isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

exports.validateMedicineSearch = [
  query("name")
    .trim()
    .notEmpty().withMessage("Medicine name is required")
    .isLength({ max: 120 }).withMessage("Medicine name too long"),
  query("lang")
    .optional()
    .isIn(["en", "hi"]).withMessage("lang must be 'en' or 'hi'"),
  validate,
];

exports.validateCompare = [
  query("a").trim().notEmpty().withMessage("First medicine name is required").isLength({ max: 120 }),
  query("b").trim().notEmpty().withMessage("Second medicine name is required").isLength({ max: 120 }),
  query("lang").optional().isIn(["en", "hi"]),
  validate,
];

export {};
