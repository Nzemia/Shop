import { Router } from "express";
import {
  markPaymentAsCompleted,
  markPaymentAsFailed,
  submitMpesaTransaction,
  simulateMpesaWebhook
} from "../../payments/controllers/payments.controller";
import validate from "../../auth/middleware/auth.middleware";
import {
  requireAuth,
  requireRole
} from "../../auth/middleware/rbac.middleware";
import { mpesaCodeSchema } from "../../payments/validators/payments.validator";

const router = Router();

router.use(requireAuth);

// Client submits M-PESA code
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

// Webhook (for future simulation)
router.post("/mpesa-webhook", simulateMpesaWebhook);

export default router;
