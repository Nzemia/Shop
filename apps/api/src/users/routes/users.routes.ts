import { Router } from "express";

import validate from "../../auth/middleware/auth.middleware";
import { updateUserSchema } from "../../users/validators/users.validator";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../../users/controllers/users.controller";
import {
  requireAuth,
  requireRole
} from "../../auth/middleware/rbac.middleware";


const router = Router();

// Only authenticated users with ADMIN or SUPERADMIN can manage users
router.use(requireAuth);
router.use(requireRole("ADMIN", "SUPERADMIN"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
