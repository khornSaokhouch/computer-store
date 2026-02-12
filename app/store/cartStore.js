import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,

  // Fetch cart items for logged-in user
  fetchCart: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return set({ cart: [] });

    set({ loading: true });
    try {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set({ cart: data.cart || [] });
      } else {
        console.warn("Failed to fetch cart:", data.message);
        set({ cart: [] });
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      set({ cart: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Add product to cart
  addToCart: async (product, quantity = 1) => {
    const { token } = useAuthStore.getState();
    if (!token) return alert("Please login first");

    const currentCart = get().cart;
    // Optimistic update
    const tempId = Date.now().toString();
    const tempItem = { _id: tempId, product, quantity };
    set({ cart: [...currentCart, tempItem] });

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Replace temp item with server cart item
        set({
          cart: get().cart.map((item) => (item._id === tempId ? data.cartItem : item)),
        });
      } else {
        console.warn("Failed to add to cart, rolling back");
        get().fetchCart(); // rollback
      }
    } catch {
      get().fetchCart(); // rollback
    }
  },

  // Update quantity of a cart item
  updateQuantity: async (cartItemId, quantity) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    // Optimistic update
    const currentCart = get().cart;
    set({
      cart: currentCart.map((item) =>
        item._id === cartItemId ? { ...item, quantity } : item
      ),
    });

    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.warn("Failed to update quantity, rolling back");
        get().fetchCart(); // rollback
      }
    } catch {
      get().fetchCart(); // rollback
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    // Optimistic update
    const currentCart = get().cart;
    set({ cart: currentCart.filter((item) => item._id !== cartItemId) });

    try {
      const res = await fetch(`/api/cart?id=${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.warn("Failed to remove from cart, rolling back");
        get().fetchCart(); // rollback
      }
    } catch {
      get().fetchCart(); // rollback
    }
  },

  // Compute total quantity in cart
  totalQuantity: () => {
    return get().cart.reduce((acc, item) => acc + item.quantity, 0);
  },

  // Compute total price
  totalPrice: () => {
    return get().cart.reduce((acc, item) => acc + item.quantity * (item.product.price || 0), 0);
  },

  // Clear entire cart
  clearCart: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    // Optimistic clear
    set({ cart: [] });

    try {
      const res = await fetch("/api/cart?all=true", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.warn("Failed to clear cart on server, fetching latest");
        get().fetchCart();
      }
    } catch {
      get().fetchCart();
    }
  },
}));
