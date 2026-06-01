import { IUser } from "../types";
import jwt from "jsonwebtoken";
import User from "../models/User";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

export const protect = catchAsync(async (req: any, _res: any, next: any) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authenticated. Please log in.", 401));
  }

  let decoded;
  try {
    decoded = (jwt.verify(token, process.env.JWT_SECRET as string) as any);
  } catch {
    return next(new AppError("Invalid or expired token. Please log in again.", 401));
  }

  const user = await User.findById<IUser>(decoded.id).select("+passwordChangedAt");
  if (!user) return next(new AppError("User no longer exists.", 401));
  if (!user.isActive) return next(new AppError("Account deactivated.", 403));
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("Password recently changed. Please log in again.", 401));
  }

  req.user = user;
  next();
});

export const optionalAuth = catchAsync(async (req: any, _res: any, next: any) => {
  let token;

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next();
  try {
    const decoded = (jwt.verify(token, process.env.JWT_SECRET as string) as any);
    const user = await User.findById<IUser>(decoded.id).select("+passwordChangedAt");
    
    if (user && user.isActive && !user.changedPasswordAfter(decoded.iat)) {
      req.user = user;
    }
  } catch {
    // silently ignore – route works without auth too
  }
  next();
});

export const restrictTo = (...roles: string[]) => (req: any, _res: any, next: any) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError("You do not have permission to perform this action.", 403));
  }
  next();
};
