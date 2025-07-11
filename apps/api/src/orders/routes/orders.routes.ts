import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from "../../orders/controllers/orders.controller";

import {
  requireAuth,
  requireRole
} from "../../auth/middleware/rbac.middleware";
import validate from "../../auth/middleware/auth.middleware";
import {
  orderSchema,
  orderStatusSchema
} from "../../orders/validators/orders.validator";

const router = Router();

router.use(requireAuth);
router.get("/", requireRole("ADMIN", "SUPERADMIN"), getAllOrders);
router.get("/:id", requireRole("ADMIN", "SUPERADMIN"), getOrderById);
router.post("/", validate(orderSchema), createOrder);
router.patch(
  "/:id/status",
  requireRole("ADMIN", "SUPERADMIN"),
  validate(orderStatusSchema),
  updateOrderStatus
);

export default router;
