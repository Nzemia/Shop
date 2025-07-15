import { Request, Response } from "express";
import * as ReviewService from "../services/reviews.service";

export const createReview = async (req: Request, res: Response): Promise<void> => {
  const { id: productId } = req.params;
  const userId = req.user?.id || req.body.userId;
  try {
    const review = await ReviewService.createReview(productId, userId, req.body);
    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Could not create review." });
  }
};

export const getReviewsByProduct = async (req: Request, res: Response): Promise<void> => {
  const { id: productId } = req.params;
  const role = req.user?.role || req.body.role;
  const result = await ReviewService.getReviewsByProduct(productId, role);
  res.status(200).json(result);
};

export const setReviewHidden = async (req: Request, res: Response): Promise<void> => {
  const { reviewId } = req.params;
  const { hidden } = req.body;
  const role = req.user?.role || req.body.role;
  try {
    const review = await ReviewService.setReviewHidden(reviewId, hidden, role);
    res.status(200).json(review);
  } catch (error: any) {
    res.status(403).json({ message: error.message || "Could not update review visibility." });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  const { reviewId } = req.params;
  const userId = req.user?.id || req.body.userId;
  const role = req.user?.role || req.body.role;
  try {
    const review = await ReviewService.updateReview(reviewId, userId, role, req.body);
    res.status(200).json(review);
  } catch (error: any) {
    res.status(403).json({ message: error.message || "Could not update review." });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  const { reviewId } = req.params;
  const userId = req.user?.id || req.body.userId;
  const role = req.user?.role || req.body.role;
  try {
    await ReviewService.deleteReview(reviewId, userId, role);
    res.status(204).send();
  } catch (error: any) {
    res.status(403).json({ message: error.message || "Could not delete review." });
  }
};
