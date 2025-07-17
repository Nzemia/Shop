import { Request, Response } from "express";
import * as PaymentService from "../services/payments.service";
import * as MpesaService from "../../orders/services/mpesa.service";

export const initiateMpesaPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const result = await MpesaService.initiateMpesaPayment(orderId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to initiate M-Pesa payment"
    });
  }
};

export const queryMpesaPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const result = await MpesaService.queryMpesaPayment(orderId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to query M-Pesa payment"
    });
  }
};

export const handleMpesaCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await MpesaService.handleMpesaCallback(req.body);

    // Always respond with success to M-Pesa
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Success"
    });
  } catch (error: any) {
    console.error("M-Pesa callback error:", error);

    // Still respond with success to avoid retries
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Success"
    });
  }
};

export const submitMpesaTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { transactionId } = req.body;
    const { orderId } = req.params;

    const order = await PaymentService.saveMpesaCode(
      orderId,
      transactionId,
      req.user!.id
    );

    res.status(200).json({
      success: true,
      message: "Transaction received",
      data: order
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to submit transaction"
    });
  }
};

export const markPaymentAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await PaymentService.updatePaymentStatus(
      req.params.orderId,
      "COMPLETED"
    );

    res.status(200).json({
      success: true,
      message: "Payment marked as completed",
      data: order
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to mark payment as completed"
    });
  }
};

export const markPaymentAsFailed = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await PaymentService.updatePaymentStatus(
      req.params.orderId,
      "FAILED"
    );

    res.status(200).json({
      success: true,
      message: "Payment marked as failed",
      data: order
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to mark payment as failed"
    });
  }
};
