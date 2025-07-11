import prisma from "../../shared/config/database.config";

export const updatePaymentStatus = async (
  orderId: string,
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: status }
  });
};

export const saveMpesaCode = async (
  orderId: string,
  transactionId: string,
  userId?: string
) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) throw new Error("Order not found");
  if (userId && order.userId !== userId) throw new Error("Access denied");

  return prisma.order.update({
    where: { id: orderId },
    data: {
      mpesaTransactionId: transactionId,
      paymentMethod: "MPESA"
    }
  });
};
