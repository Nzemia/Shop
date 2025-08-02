import prisma from "../../shared/config/database.config";
import { stkPush } from "../../lib/mpesa";

interface CreateOrderData {
  orderItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: "MPESA" | "DOOR_DELIVERY";
  phoneNumber?: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    county: string;
  };
}

export const createOrder = async (data: CreateOrderData, userId: string) => {
  const orderNumber = `ORD-${Date.now()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      phoneNumber: data.phoneNumber,
      shippingAddress: data.shippingAddress,
      orderItems: {
        create: data.orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });

  // If payment method is M-Pesa, initiate STK push
  if (data.paymentMethod === "MPESA" && data.phoneNumber) {
    try {
      const mpesaResponse = await stkPush({
        phone: data.phoneNumber,
        amount: Number(data.totalAmount),
        orderId: order.id
      });

      // Update order with M-Pesa checkout request ID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          mpesaTransactionId: mpesaResponse.CheckoutRequestID
        }
      });
    } catch (error) {
      console.error("M-Pesa STK Push failed:", error);
    }
  }

  return order;
};

export const getAllOrders = async (page = 1, limit = 20, filters?: {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  trackingStatus?: string;
  search?: string;
}) => {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.status) where.status = filters.status;
  if (filters?.paymentStatus) where.paymentStatus = filters.paymentStatus;
  if (filters?.paymentMethod) where.paymentMethod = filters.paymentMethod;
  if (filters?.trackingStatus) where.trackingStatus = filters.trackingStatus;

  if (filters?.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: 'insensitive' } },
      { user: { username: { contains: filters.search, mode: 'insensitive' } } },
      { user: { email: { contains: filters.search, mode: 'insensitive' } } }
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true
              }
            }
          }
        }
      }
    }),
    prisma.order.count({ where })
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getRecentOrders = async (limit = 10) => {
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true
            }
          }
        }
      }
    }
  });
};

export const getOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
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
  status?: "PENDING" | "PAID" | "CANCELED" | "DELIVERED",
  trackingStatus?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED",
  paymentStatus?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
) => {
  const updateData: any = {};

  if (status) updateData.status = status;
  if (trackingStatus) updateData.trackingStatus = trackingStatus;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  return prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });
};

export const getOrderStats = async () => {
  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    canceledOrders,
    pendingPayments,
    completedPayments,
    failedPayments,
    mpesaOrders,
    doorDeliveryOrders,
    todayOrders,
    thisWeekOrders,
    thisMonthOrders,
    totalRevenue,
    thisMonthRevenue
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { trackingStatus: "PENDING" } }),
    prisma.order.count({ where: { trackingStatus: "CONFIRMED" } }),
    prisma.order.count({ where: { trackingStatus: "SHIPPED" } }),
    prisma.order.count({ where: { trackingStatus: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELED" } }),
    prisma.order.count({ where: { paymentStatus: "PENDING" } }),
    prisma.order.count({ where: { paymentStatus: "COMPLETED" } }),
    prisma.order.count({ where: { paymentStatus: "FAILED" } }),
    prisma.order.count({ where: { paymentMethod: "MPESA" } }),
    prisma.order.count({ where: { paymentMethod: "DOOR_DELIVERY" } }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.order.aggregate({
      where: { paymentStatus: "COMPLETED" },
      _sum: { totalAmount: true }
    }),
    prisma.order.aggregate({
      where: {
        paymentStatus: "COMPLETED",
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { totalAmount: true }
    })
  ]);

  return {
    overview: {
      totalOrders,
      todayOrders,
      thisWeekOrders,
      thisMonthOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      thisMonthRevenue: thisMonthRevenue._sum.totalAmount || 0
    },
    tracking: {
      pending: pendingOrders,
      confirmed: confirmedOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      canceled: canceledOrders
    },
    payments: {
      pending: pendingPayments,
      completed: completedPayments,
      failed: failedPayments
    },
    paymentMethods: {
      mpesa: mpesaOrders,
      doorDelivery: doorDeliveryOrders
    }
  };
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

