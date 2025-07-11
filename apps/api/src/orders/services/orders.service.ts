import prisma from "../../shared/config/database.config";

export const createOrder = async (data: any, userId: string) => {
  const orderNumber = `ORD-${Date.now()}`;
  return prisma.order.create({
    data: {
      ...data,
      orderNumber,
      userId
    },
    include: {
      orderItems: true
    }
  });
};

export const getAllOrders = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });
};

export const getOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });
};

export const updateOrderStatus = async (
  id: string,
  status: "PENDING" | "PAID" | "CANCELED",
  trackingStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED"
) => {
  return prisma.order.update({
    where: { id },
    data: {
      status,
      trackingStatus
    }
  });
};
