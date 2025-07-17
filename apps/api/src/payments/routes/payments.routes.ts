import { Router } from "express";
import {
  initiateMpesaPayment,
  queryMpesaPayment,
  handleMpesaCallback,
  markPaymentAsCompleted,
  markPaymentAsFailed,
  submitMpesaTransaction
} from "../../payments/controllers/payments.controller";
import validate from "../../auth/middleware/auth.middleware";
import {
  requireAuth,
  requireRole
} from "../../auth/middleware/rbac.middleware";
import { mpesaCodeSchema } from "../../payments/validators/payments.validator";

const router = Router();

// M-Pesa callback (no auth required)
router.post("/mpesa-callback", handleMpesaCallback);

// Protected routes
router.use(requireAuth);

// M-Pesa payment initiation and query
router.post("/mpesa/initiate/:orderId", initiateMpesaPayment);
router.get("/mpesa/query/:orderId", queryMpesaPayment);

// Client submits M-PESA code (manual verification)
router.post(
  "/submit-mpesa/:orderId",
  validate(mpesaCodeSchema),
  submitMpesaTransaction
);

// Admin actions
router.post(
  "/complete/:orderId",
  requireRole("ADMIN", "SUPERADMIN"),
  markPaymentAsCompleted
);
router.post(
  "/fail/:orderId",
  requireRole("ADMIN", "SUPERADMIN"),
  markPaymentAsFailed
);

export default router;
