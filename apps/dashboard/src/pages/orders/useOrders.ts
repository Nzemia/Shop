import { useEffect, useState } from "react";
import api from "../../lib/api";

export const useOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const res = await api.get("/orders");
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const updateOrderStatus = async (
    id: string,
    data: { status: string; trackingStatus: string }
  ) => {
    await api.patch(`/orders/${id}/status`, data);
    await fetch();
  };

  return {
    orders,
    loading,
    updateOrderStatus
  };
};
