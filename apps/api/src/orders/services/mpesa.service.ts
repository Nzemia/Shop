import prisma from "../../shared/config/database.config";
import { stkPush, stkQuery } from "../../lib/mpesa";

export const initiateMpesaPayment = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: {
                select: {
                    username: true,
                    email: true
                }
            }
        }
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.paymentMethod !== "MPESA") {
        throw new Error("Order payment method is not M-Pesa");
    }

    if (!order.phoneNumber) {
        throw new Error("Phone number is required for M-Pesa payment");
    }

    try {
        const mpesaResponse = await stkPush({
            phone: order.phoneNumber,
            amount: Number(order.totalAmount),
            orderId: order.id
        });

        // Update order with M-Pesa checkout request ID
        await prisma.order.update({
            where: { id: orderId },
            data: {
                mpesaTransactionId: mpesaResponse.CheckoutRequestID
            }
        });

        return {
            success: true,
            checkoutRequestId: mpesaResponse.CheckoutRequestID,
            message: "M-Pesa payment initiated successfully"
        };
    } catch (error: any) {
        console.error("M-Pesa initiation failed:", error);
        throw new Error("Failed to initiate M-Pesa payment");
    }
};

export const queryMpesaPayment = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if (!order || !order.mpesaTransactionId) {
        throw new Error("Order or M-Pesa transaction not found");
    }

    try {
        const queryResponse = await stkQuery(order.mpesaTransactionId);
        return queryResponse;
    } catch (error: any) {
        console.error("M-Pesa query failed:", error);
        throw new Error("Failed to query M-Pesa payment status");
    }
};

export const handleMpesaCallback = async (callbackData: any) => {
    try {
        const { Body } = callbackData;
        const { stkCallback } = Body;

        const checkoutRequestId = stkCallback.CheckoutRequestID;
        const resultCode = stkCallback.ResultCode;
        const resultDesc = stkCallback.ResultDesc;

        // Find order by checkout request ID
        const order = await prisma.order.findFirst({
            where: {
                mpesaTransactionId: checkoutRequestId
            }
        });

        if (!order) {
            console.error("Order not found for checkout request ID:", checkoutRequestId);
            return { success: false, message: "Order not found" };
        }

        if (resultCode === 0) {
            // Payment successful
            const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
            const mpesaReceiptNumber = callbackMetadata.find(
                (item: any) => item.Name === "MpesaReceiptNumber"
            )?.Value;

            await prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: "COMPLETED",
                    status: "PAID",
                    mpesaTransactionId: mpesaReceiptNumber || checkoutRequestId
                }
            });

            console.log(`Payment completed for order ${order.orderNumber}`);
            return { success: true, message: "Payment completed successfully" };
        } else {
            // Payment failed
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: "FAILED"
                }
            });

            console.log(`Payment failed for order ${order.orderNumber}: ${resultDesc}`);
            return { success: false, message: resultDesc };
        }
    } catch (error: any) {
        console.error("M-Pesa callback processing error:", error);
        return { success: false, message: "Failed to process callback" };
    }
};