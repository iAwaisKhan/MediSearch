"use strict";
const jwt      = require("jsonwebtoken");
const User     = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.protect = catchAsync(async (req, _res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authenticated. Please log in.", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next(new AppError("Invalid or expired token. Please log in again.", 401));
  }

  const user = await User.findById(decoded.id).select("+passwordChangedAt");
  if (!user) return next(new AppError("User no longer exists.", 401));
  if (!user.isActive) return next(new AppError("Account deactivated.", 403));
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("Password recently changed. Please log in again.", 401));
  }

  req.user = user;
  next();
});

exports.optionalAuth = catchAsync(async (req, _res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch {
    // silently ignore – route works without auth too
  }
  next();
});

exports.restrictTo = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError("You do not have permission to perform this action.", 403));
  }
  next();
};

export {};
