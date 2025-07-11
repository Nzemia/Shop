import { useEffect, useState } from "react";
import axios from "axios";

export const useOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const res = await axios.get("/api/orders");
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
    await axios.patch(`/api/orders/${id}/status`, data);
    await fetch();
  };

  return {
    orders,
    loading,
    updateOrderStatus
  };
};
