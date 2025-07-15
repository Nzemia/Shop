import { Router } from "express";
import { createReview, getReviewsByProduct, updateReview, deleteReview, setReviewHidden } from "../controllers/reviews.controller";
import validate from "../../auth/middleware/auth.middleware";
import { reviewSchema, updateReviewSchema } from "../validators/reviews.validator";
import { requireAuth } from "../../auth/middleware/rbac.middleware";

const router = Router({ mergeParams: true });

router.get("/", getReviewsByProduct);
router.post("/", requireAuth, validate(reviewSchema), createReview);
router.patch("/:reviewId", requireAuth, validate(updateReviewSchema), updateReview);
router.delete("/:reviewId", requireAuth, deleteReview);
router.patch("/:reviewId/hide", requireAuth, setReviewHidden);

export default router;
