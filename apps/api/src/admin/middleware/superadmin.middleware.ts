import { Request, Response, NextFunction } from "express";

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;
  if (!user || user.role !== "SUPERADMIN") {
    res.status(403).json({ message: "Access denied - SUPERADMIN only" });
    return;
  }
  next();
};
