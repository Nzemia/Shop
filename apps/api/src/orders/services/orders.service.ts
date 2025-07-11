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

export const cancelOrder = async (id: string, userId: string) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Access denied");
  if (order.status !== "PENDING")
    throw new Error("Only pending orders can be canceled");

  return prisma.order.update({
    where: { id },
    data: { status: "CANCELED" }
  });
};

export const requestRefund = async (
  id: string,
  userId: string,
  reason: string
) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Access denied");
  if (order.paymentStatus !== "COMPLETED")
    throw new Error("Only paid orders can be refunded");

  return prisma.order.update({
    where: { id },
    data: {
      isRefundRequested: true,
      refundReason: reason
    }
  });
};

