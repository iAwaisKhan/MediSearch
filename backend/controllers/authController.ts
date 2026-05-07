"use strict";
const User       = require("../models/User");
const AppError   = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const logger     = require("../utils/logger");

// Helper: send token response
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJWT();
  const cookieOptions = {
    expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res
    .status(statusCode)
    .cookie("jwt", token, cookieOptions)
    .json({
      status: "success",
      token,
      data: { user },
    });
};

// POST /api/auth/register
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, preferredLang } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return next(new AppError("Email already registered.", 400));

  const user = await User.create({ name, email, password, preferredLang });
  logger.info(`New user registered: ${email}`);
  sendToken(user, 201, res);
});

// POST /api/auth/login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError("Invalid email or password.", 401));
  }
  if (!user.isActive) return next(new AppError("Account deactivated. Contact support.", 403));

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  logger.info(`User logged in: ${email}`);
  sendToken(user, 200, res);
});

// GET /api/auth/me
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ status: "success", data: { user } });
});

// PATCH /api/auth/update-profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, preferredLang } = req.body;
  if (req.body.password) {
    return next(new AppError("Use /change-password to update your password.", 400));
  }
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, preferredLang },
    { new: true, runValidators: true }
  );
  res.status(200).json({ status: "success", data: { user } });
});

// PATCH /api/auth/change-password
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    return next(new AppError("Current password is incorrect.", 401));
  }
  user.password          = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();
  sendToken(user, 200, res);
});

// POST /api/auth/logout
exports.logout = (_req, res) => {
  res
    .cookie("jwt", "", { expires: new Date(0), httpOnly: true })
    .status(200)
    .json({ status: "success", message: "Logged out successfully." });
};

export {};
