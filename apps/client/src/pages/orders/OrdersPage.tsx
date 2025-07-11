import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Orders</h2>

      {loading ? (
        <p>
          <Loader2 className="animate-spin" />
        </p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground">You have no recent orders.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded-md space-y-2 shadow-sm"
            >
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Order #{order.orderNumber}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <strong>Status:</strong> {order.paymentStatus}
                </p>
                <p>
                  <strong>Tracking:</strong> {order.trackingStatus}
                </p>
                <p>
                  <strong>Total:</strong> Ksh{" "}
                  {Number(order.totalAmount).toFixed(2)}
                </p>
              </div>

              <div className="text-sm pt-2 border-t text-muted-foreground">
                Items:
                <ul className="list-disc list-inside ml-4 mt-1">
                  {order.items.map((item: any) => (
                    <li key={item.id}>
                      {item.product?.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
