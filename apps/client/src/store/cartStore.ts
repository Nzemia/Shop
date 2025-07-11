import { create } from "zustand";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartStore>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.find((p) => p.id === item.id);
      if (exists) {
        return {
          cart: state.cart.map((p) =>
            p.id === item.id
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          )
        };
      }
      return { cart: [...state.cart, item] };
    }),
  updateQuantity: (id, qty) =>
    set((state) => ({
      cart: state.cart.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    })),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((p) => p.id !== id)
    })),
  clearCart: () => set({ cart: [] })
}));
