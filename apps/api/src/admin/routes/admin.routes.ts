import { Router } from "express";
import {
  getAllAdmins,
  promoteUserToAdmin,
  demoteAdminToUser
} from "../../admin/controllers/admin.controller";
import { requireAuth } from "../../auth/middleware/rbac.middleware";
import { requireSuperAdmin } from "../middleware/superadmin.middleware";

const router = Router();

// SUPERADMIN access only
router.use(requireAuth, requireSuperAdmin);

router.get("/", getAllAdmins);
router.post("/promote", promoteUserToAdmin);
router.post("/demote", demoteAdminToUser);

export default router;
