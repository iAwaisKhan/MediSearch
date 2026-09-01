import { IUser } from "../types";
import User from "../models/User";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import logger from "../utils/logger";

// Helper: send token response
const sendToken = (user: IUser, statusCode: any, res: any) => {
  const token = user.getSignedJWT();
  const sameSite = (process.env.COOKIE_SAME_SITE || "lax") as "lax" | "strict" | "none";
  const cookieOptions = {
    expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE as string) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production" || sameSite === "none",
    sameSite,
    path: "/",
  };

  res
    .status(statusCode)
    .cookie("jwt", token, cookieOptions)
    .json({
      status: "success",
      data: { user },
    });
};
// POST /api/auth/register
export const register = catchAsync(async (req: any, res: any, next: any) => {
  const { name, email, password, preferredLang } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return next(new AppError("Email already registered.", 400));

  const user = await User.create({ name, email, password, preferredLang });
  logger.info(`New user registered: ${email}`);
  sendToken(user as any as IUser, 201, res);
});

// POST /api/auth/login
export const login = catchAsync(async (req: any, res: any, next: any) => {
  const { email, password } = req.body;

  const user = await User.findOne<IUser>({ email }).select("+password");
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
export const getMe = catchAsync(async (req: any, res: any) => {
  const user = await User.findById<IUser>(req.user.id);
  res.status(200).json({ status: "success", data: { user } });
});

// PATCH /api/auth/update-profile
export const updateProfile = catchAsync(async (req: any, res: any, next: any) => {
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
export const changePassword = catchAsync(async (req: any, res: any, next: any) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById<IUser>(req.user.id).select("+password");

  if (!user) return next(new AppError("User not found", 404));
  if (!(await user.matchPassword(currentPassword))) {
    return next(new AppError("Current password is incorrect.", 401));
  }
  user.password          = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();
  sendToken(user, 200, res);
});

// POST /api/auth/logout
export const logout = (_req: any, res: any) => {
  res
    .cookie("jwt", "", { expires: new Date(0), httpOnly: true, path: "/" })
    .status(200)
    .json({ status: "success", message: "Logged out successfully." });
};
