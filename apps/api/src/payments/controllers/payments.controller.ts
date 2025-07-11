import { Request, Response } from "express";
import * as PaymentService from "../services/payments.service";

export const submitMpesaTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { transactionId } = req.body;
  const { orderId } = req.params;

  const order = await PaymentService.saveMpesaCode(
    orderId,
    transactionId,
    req.user!.id
  );
  res.status(200).json({ message: "Transaction received", order });
};

export const markPaymentAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  const order = await PaymentService.updatePaymentStatus(
    req.params.orderId,
    "COMPLETED"
  );
  res.status(200).json({ message: "Marked as paid", order });
};

export const markPaymentAsFailed = async (
  req: Request,
  res: Response
): Promise<void> => {
  const order = await PaymentService.updatePaymentStatus(
    req.params.orderId,
    "FAILED"
  );
  res.status(200).json({ message: "Marked as failed", order });
};

export const simulateMpesaWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { orderId, transactionId } = req.body;

  const order = await PaymentService.saveMpesaCode(orderId, transactionId);
  await PaymentService.updatePaymentStatus(orderId, "COMPLETED");

  res.status(200).json({ message: "Simulated webhook received", order });
};
