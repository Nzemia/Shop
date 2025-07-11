import { useCart } from "../../store/cartStore";
import { useState } from "react";
import axios from "axios";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"MPESA" | "DOOR">("MPESA");
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handlePlaceOrder = async () => {
    if (paymentMethod === "MPESA" && phone.length < 10) {
      return alert("Enter valid phone number");
    }

    setSubmitting(true);

    try {
      // 1. Place the order first
      const orderRes = await axios.post(
        "/api/orders",
        {
          items: cart.map((p) => ({
            productId: p.id,
            quantity: p.quantity
          })),
          paymentMethod
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const orderId = orderRes.data.id;

      // 2. If MPESA, trigger STK push
      if (paymentMethod === "MPESA") {
        const phoneFormatted = phone.startsWith("254")
          ? phone
          : `254${phone.slice(-9)}`;
        const mpesaRes = await axios.post(
          "/api/payments/mpesa",
          {
            phone: phoneFormatted,
            amount: total,
            orderId
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        console.log("STK push sent:", mpesaRes.data);
        alert(
          "M-PESA STK Push sent. Please complete the payment on your phone."
        );
      } else {
        alert("Order placed! Pay on delivery.");
      }

      clearCart();
      window.location.href = "/orders";
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Failed to place order. Try again.");
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

      {paymentMethod === "MPESA" && (
        <div>
          <label className="block text-sm mb-1 font-medium">
            M-PESA Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 07XXXXXXXX"
            className="input"
          />
        </div>
      )}

      <div className="text-right">
        <button
          className="btn-primary"
          onClick={handlePlaceOrder}
          disabled={submitting || cart.length === 0}
        >
          {submitting ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
