import { Request, Response } from "express";
import * as OrderService from "../services/orders.service";
import prisma from "../../shared/config/database.config";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const order = await OrderService.createOrder(req.body, req.user!.id);
  res.status(201).json(order);
};

export const getMyOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  res.json(orders);
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

export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const order = await OrderService.cancelOrder(req.params.id, req.user!.id);
  res.status(200).json({ message: "Order canceled", order });
};

export const requestRefund = async (
  req: Request,
  res: Response
): Promise<void> => {
  const order = await OrderService.requestRefund(
    req.params.id,
    req.user!.id,
    req.body.reason
  );
  res.status(200).json({ message: "Refund requested", order });
};
