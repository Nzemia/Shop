
import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { useOrders } from "./useOrders";
import UpdateOrderForm from "./UpdateOrderForm";

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const [editing, setEditing] = useState<any>(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Orders</h2>

      {loading ? (
              <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Order #</th>
                <th className="p-2">User</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Tracking</th>
                <th className="p-2">Updated</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/40">
                  <td className="p-2">{order.orderNumber}</td>
                  <td className="p-2">{order.user?.email}</td>
                  <td className="p-2">
                    Ksh {Number(order.totalAmount).toFixed(2)}
                  </td>
                  <td className="p-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.paymentStatus === "COMPLETED"
                          ? "bg-green-200 text-green-700"
                          : order.paymentStatus === "FAILED"
                          ? "bg-red-200 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-2">{order.trackingStatus}</td>
                  <td className="p-2">
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <button onClick={() => setEditing(order)}>
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <UpdateOrderForm order={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
