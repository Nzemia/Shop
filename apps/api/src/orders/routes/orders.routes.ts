import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  getRecentOrders,
  getOrderStats,
  updateOrderStatus,
  cancelOrder,
  requestRefund
} from "../../orders/controllers/orders.controller";

import {
  requireAuth,
  requireRole
} from "../../auth/middleware/rbac.middleware";
import validate from "../../auth/middleware/auth.middleware";
import {
  orderSchema,
  orderStatusSchema,
  refundSchema
} from "../../orders/validators/orders.validator";

const router = Router();

router.use(requireAuth);

// Admin routes
router.get("/", requireRole("ADMIN", "SUPERADMIN"), getAllOrders);
router.get("/recent", requireRole("ADMIN", "SUPERADMIN"), getRecentOrders);
router.get("/stats", requireRole("ADMIN", "SUPERADMIN"), getOrderStats);
router.get("/:id", requireRole("ADMIN", "SUPERADMIN"), getOrderById);

// User routes
router.post("/", validate(orderSchema), createOrder);
router.get("/my/orders", getMyOrders);
router.post("/:id/cancel", cancelOrder);
router.post("/:id/request-refund", validate(refundSchema), requestRefund);

// Admin actions
router.patch(
  "/:id/status",
  requireRole("ADMIN", "SUPERADMIN"),
  validate(orderStatusSchema),
  updateOrderStatus
);

export default router;
