import { Router } from "express";

import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  verifyAuth,
  verifyToken
} from "../../auth/controllers/auth.controller";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema
} from "../validators/auth.validator";

import validate from "../../auth/middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

// Protected routes
router.get("/verify", verifyAuth);

// TODO:: protected route using middleware
router.get("/profile", verifyToken, (req, res) => {
  res.json({ user: (req as any).user });
});

export default router;
