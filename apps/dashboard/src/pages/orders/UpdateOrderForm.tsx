import { useOrders } from "./useOrders";


export default function UpdateOrderForm({
  order,
  onClose
}: {
  order: any;
  onClose: () => void;
}) {
  const { updateOrderStatus } = useOrders();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const status = form.get("paymentStatus") as string;
    const trackingStatus = form.get("trackingStatus") as string;

    await updateOrderStatus(order.id, { status, trackingStatus });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-background p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h3 className="text-lg font-bold mb-2">
          Update Order #{order.orderNumber}
        </h3>

        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Status
          </label>
          <select
            name="paymentStatus"
            defaultValue={order.paymentStatus}
            className="input"
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tracking Status
          </label>
          <select
            name="trackingStatus"
            defaultValue={order.trackingStatus}
            className="input"
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-muted">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
