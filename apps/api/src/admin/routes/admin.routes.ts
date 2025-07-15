import { Router } from "express";
import {
  getAllAdmins,
  promoteUserToAdmin,
  demoteAdminToUser,
  getCurrentAdmin,
  updateCurrentAdmin
} from "../../admin/controllers/admin.controller";
import { requireAuth, requireRole } from "../../auth/middleware/rbac.middleware";
import { requireSuperAdmin } from "../middleware/superadmin.middleware";

const router = Router();

router.get("/me", requireAuth, requireRole("ADMIN", "SUPERADMIN"), getCurrentAdmin);
router.put("/me", requireAuth, requireRole("ADMIN", "SUPERADMIN"), updateCurrentAdmin);

router.use(requireAuth, requireSuperAdmin);

router.get("/", getAllAdmins);
router.post("/promote", promoteUserToAdmin);
router.post("/demote", demoteAdminToUser);

export default router;
