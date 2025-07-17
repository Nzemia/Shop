import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELED" | "DELIVERED";
  trackingStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED";
  paymentMethod: "MPESA" | "DOOR_DELIVERY";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  phoneNumber?: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    county: string;
  };
  mpesaTransactionId?: string;
  isRefundRequested: boolean;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
    };
  }>;
}

export interface OrderStats {
  overview: {
    totalOrders: number;
    todayOrders: number;
    thisWeekOrders: number;
    thisMonthOrders: number;
    totalRevenue: number;
    thisMonthRevenue: number;
  };
  tracking: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    canceled: number;
  };
  payments: {
    pending: number;
    completed: number;
    failed: number;
  };
  paymentMethods: {
    mpesa: number;
    doorDelivery: number;
  };
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  trackingStatus?: string;
  search?: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState<OrderFilters>({});

  const fetchOrders = async (page = 1, newFilters?: OrderFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(newFilters || filters)
      });

      const res = await api.get(`/orders?${params}`);

      if (res.data.success) {
        setOrders(res.data.data.orders);
        setPagination(res.data.data.pagination);
      }
    } catch (error: any) {
      toast.error("Failed to fetch orders");
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await api.get("/orders/recent?limit=5");
      if (res.data.success) {
        setRecentOrders(res.data.data);
      }
    } catch (error: any) {
      console.error("Fetch recent orders error:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await api.get("/orders/stats");
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch order statistics");
      console.error("Fetch stats error:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (error: any) {
      toast.error("Failed to fetch order details");
      console.error("Fetch order error:", error);
      return null;
    }
  };

  const updateOrderStatus = async (
    id: string,
    data: {
      status?: "PENDING" | "PAID" | "CANCELED" | "DELIVERED";
      trackingStatus?: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED";
      paymentStatus?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
    }
  ) => {
    try {
      const res = await api.patch(`/orders/${id}/status`, data);
      if (res.data.success) {
        toast.success("Order status updated successfully");
        await fetchOrders(pagination.page);
        await fetchStats();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update order status");
      console.error("Update order error:", error);
      return false;
    }
  };

  const markPaymentCompleted = async (orderId: string) => {
    try {
      const res = await api.post(`/payments/complete/${orderId}`);
      if (res.data.success) {
        toast.success("Payment marked as completed");
        await fetchOrders(pagination.page);
        await fetchStats();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to mark payment as completed");
      return false;
    }
  };

  const markPaymentFailed = async (orderId: string) => {
    try {
      const res = await api.post(`/payments/fail/${orderId}`);
      if (res.data.success) {
        toast.success("Payment marked as failed");
        await fetchOrders(pagination.page);
        await fetchStats();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to mark payment as failed");
      return false;
    }
  };

  const initiateMpesaPayment = async (orderId: string) => {
    try {
      const res = await api.post(`/payments/mpesa/initiate/${orderId}`);
      if (res.data.success) {
        toast.success("M-Pesa payment initiated");
        return res.data.data;
      }
      return null;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate M-Pesa payment");
      return null;
    }
  };

  const queryMpesaPayment = async (orderId: string) => {
    try {
      const res = await api.get(`/payments/mpesa/query/${orderId}`);
      if (res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to query M-Pesa payment");
      return null;
    }
  };

  const applyFilters = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    fetchOrders(1, newFilters);
  };

  const changePage = (page: number) => {
    fetchOrders(page);
  };

  useEffect(() => {
    fetchOrders();
    fetchRecentOrders();
    fetchStats();
  }, []);

  return {
    // Data
    orders,
    recentOrders,
    stats,
    pagination,
    filters,

    // Loading states
    loading,
    statsLoading,

    // Actions
    fetchOrders,
    fetchRecentOrders,
    fetchStats,
    getOrderById,
    updateOrderStatus,
    markPaymentCompleted,
    markPaymentFailed,
    initiateMpesaPayment,
    queryMpesaPayment,
    applyFilters,
    changePage
  };
};
