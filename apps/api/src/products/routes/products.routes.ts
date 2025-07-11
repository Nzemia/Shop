import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../../products/controllers/products.controller";

import {
  requireAuth,
  requireRole
} from "../../auth/middleware/rbac.middleware";
import validate from "../../auth/middleware/auth.middleware";
import {
  productSchema,
  updateProductSchema
} from "../../products/validators/products.validator";

const router = Router();

router.use(requireAuth, requireRole("ADMIN", "SUPERADMIN"));

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", validate(productSchema), createProduct);
router.put("/:id", validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
