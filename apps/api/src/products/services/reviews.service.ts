import prisma from "../../shared/config/database.config";

export const createReview = async (productId: string, userId: string, data: any) => {
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: {
          in: ["PAID", "DELIVERED"]
        }
      }
    }
  });
  if (!hasPurchased) {
    throw new Error("You can only review products you have purchased.");
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      productId,
      userId
    }
  });
  if (existingReview) {
    throw new Error("You have already reviewed this product.");
  }

  return prisma.review.create({
    data: {
      ...data,
      productId,
      userId
    }
  });
};

export const getReviewsByProduct = async (productId: string, role?: string) => {
  const where = { productId } as any;
  if (role !== "SUPERADMIN") {
    where.hidden = false;
  }
  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;
  return { reviews, avgRating };
};

export const setReviewHidden = async (reviewId: string, hidden: boolean, role: string) => {
  if (role !== "SUPERADMIN") {
    throw new Error("Only SUPERADMIN can hide/unhide reviews.");
  }
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Review not found.");
  return prisma.review.update({ where: { id: reviewId }, data: { hidden } });
};

export const updateReview = async (reviewId: string, userId: string, role: string, data: any) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Review not found.");
  if (review.userId !== userId && role !== "SUPERADMIN") {
    throw new Error("You are not authorized to update this review.");
  }
  return prisma.review.update({ where: { id: reviewId }, data });
};

export const deleteReview = async (reviewId: string, userId: string, role: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Review not found.");
  if (review.userId !== userId && role !== "SUPERADMIN") {
    throw new Error("You are not authorized to delete this review.");
  }
  return prisma.review.delete({ where: { id: reviewId } });
};
