import { z } from "zod";

export const orderSchema = z.object({
  totalAmount: z.number().positive(),
  phoneNumber: z.string(),
  shippingAddress: z.any(), // can be object
  paymentMethod: z.enum(["MPESA", "DOOR_DELIVERY"]),
  paymentStatus: z
    .enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"])
    .optional(),
  trackingStatus: z
    .enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"])
    .optional(),
  orderItems: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number().positive()
    })
  )
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELED"]),
  trackingStatus: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"])
});
