import { Request, Response } from "express";
import * as OrderService from "../services/orders.service";
import prisma from "../../shared/config/database.config";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await OrderService.createOrder(req.body, req.user!.id);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create order"
    });
  }
};

export const getMyOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders"
    });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const filters = {
      status: req.query.status as string,
      paymentStatus: req.query.paymentStatus as string,
      paymentMethod: req.query.paymentMethod as string,
      trackingStatus: req.query.trackingStatus as string,
      search: req.query.search as string
    };

    const result = await OrderService.getAllOrders(page, limit, filters);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders"
    });
  }
};

export const getRecentOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const orders = await OrderService.getRecentOrders(limit);
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch recent orders"
    });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found"
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order"
    });
  }
};

export const getOrderStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await OrderService.getOrderStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order statistics"
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, trackingStatus, paymentStatus } = req.body;

    const updated = await OrderService.updateOrderStatus(
      req.params.id,
      status,
      trackingStatus,
      paymentStatus
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updated
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update order status"
    });
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await OrderService.cancelOrder(req.params.id, req.user!.id);
    res.status(200).json({
      success: true,
      message: "Order canceled successfully",
      data: order
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to cancel order"
    });
  }
};

export const requestRefund = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await OrderService.requestRefund(
      req.params.id,
      req.user!.id,
      req.body.reason
    );
    res.status(200).json({
      success: true,
      message: "Refund requested successfully",
      data: order
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to request refund"
    });
  }
};
