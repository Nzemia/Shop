import { z } from "zod";

const shippingAddressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  county: z.string().min(2, "County is required")
});

export const orderSchema = z.object({
  totalAmount: z.number().positive("Total amount must be positive"),
  phoneNumber: z.string().optional(),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["MPESA", "DOOR_DELIVERY"]),
  orderItems: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      price: z.number().positive("Price must be positive")
    })
  ).min(1, "At least one order item is required")
}).refine((data) => {
  // If payment method is MPESA, phone number is required
  if (data.paymentMethod === "MPESA" && !data.phoneNumber) {
    return false;
  }
  return true;
}, {
  message: "Phone number is required for M-Pesa payments",
  path: ["phoneNumber"]
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "CANCELED", "DELIVERED"]).optional(),
  trackingStatus: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"]).optional(),
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional()
}).refine((data) => {
  // At least one status field must be provided
  return data.status || data.trackingStatus || data.paymentStatus;
}, {
  message: "At least one status field must be provided"
});

export const refundSchema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters")
});
