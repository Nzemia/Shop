import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../shared/config/jwt.config";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized - Missing token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret) as {
      id: string;
      role: string;
    };
    req.user = decoded; 
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      res
        .status(403)
        .json({ message: "Access denied - Insufficient permissions" });
      return;
    }
    next();
  };
};
