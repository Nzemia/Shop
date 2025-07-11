import { Request, Response } from "express";
import * as OrderService from "../services/orders.service";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const order = await OrderService.createOrder(req.body, req.user!.id);
  res.status(201).json(order);
};

export const getAllOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const orders = await OrderService.getAllOrders();
  res.status(200).json(orders);
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const order = await OrderService.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }
  res.status(200).json(order);
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const updated = await OrderService.updateOrderStatus(
    req.params.id,
    req.body.status,
    req.body.trackingStatus
  );
  res.status(200).json(updated);
};
