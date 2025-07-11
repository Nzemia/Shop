import { Router } from "express";
import { requireAuth } from "../../auth/middleware/rbac.middleware";
import { triggerMpesaPayment } from "./payment.controller";

const router = Router();

router.post("/mpesa", requireAuth, triggerMpesaPayment);

export default router;
