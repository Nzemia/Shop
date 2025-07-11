import { useCart } from "../../store/cartStore";
import { Trash } from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart((state) => ({
    cart: state.cart,
    updateQuantity: (id: string, qty: number) =>
      (state.cart = state.cart.map((p) =>
        p.id === id ? { ...p, quantity: qty } : p
      )),
    removeFromCart: (id: string) =>
      (state.cart = state.cart.filter((p) => p.id !== id))
  }));

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-2xl font-bold">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-center border-b pb-4"
              >
                <img
                  src={item.image || "https://via.placeholder.com/80"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Ksh {Number(item.price).toFixed(2)} × {item.quantity}
                  </p>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    className="input w-20"
                  />
                </div>
                <button onClick={() => removeFromCart(item.id)}>
                  <Trash size={18} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <p className="text-lg font-semibold">Subtotal</p>
            <p className="text-lg font-bold text-primary">
              Ksh {total.toFixed(2)}
            </p>
          </div>

          <div className="text-right">
            <a href="/checkout" className="btn-primary inline-block">
              Proceed to Checkout
            </a>
          </div>
        </>
      )}
    </div>
  );
}
