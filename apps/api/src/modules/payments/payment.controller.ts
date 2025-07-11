import { Request, Response } from "express";
import { stkPush } from "../../lib/mpesa";

export const triggerMpesaPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  const { phone, amount, orderId } = req.body;

  if (!phone || !amount || !orderId) {
    res.status(400).json({ message: "Missing fields" });
    return;
  }

  try {
    const response = await stkPush({ phone, amount, orderId });
    res.json(response);
  } catch (err: any) {
    console.error("M-PESA STK Error:", err.response?.data || err.message);
    res.status(500).json({ message: "STK Push Failed" });
  }
};
