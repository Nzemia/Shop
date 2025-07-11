import { useCart } from "../../store/cartStore";
import { useState } from "react";
import axios from "axios";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"MPESA" | "DOOR">("MPESA");
  const [submitting, setSubmitting] = useState(false);

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post("/api/orders", {
        items: cart.map((p) => ({
          productId: p.id,
          quantity: p.quantity
        })),
        paymentMethod
      });

      if (res.data) {
        console.log(res.data);
      }

      clearCart();
      alert("Order placed successfully!");
      window.location.href = "/shop";
    } catch (err) {
      alert("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Checkout</h2>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-2">
            <p>
              {item.name} × {item.quantity}
            </p>
            <p>Ksh {(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="text-right font-bold text-lg text-primary">
        Total: Ksh {total.toFixed(2)}
      </div>

      <div>
        <label className="block text-sm mb-1 font-medium">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as "MPESA" | "DOOR")}
          className="input"
        >
          <option value="MPESA">M-PESA</option>
          <option value="DOOR">Pay on Delivery</option>
        </select>
      </div>

      <div className="text-right">
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={submitting || cart.length === 0}
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
