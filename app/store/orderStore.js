// store/orderStore.js
import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,

  // Fetch all orders for the logged-in user
  fetchOrders: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return set({ orders: [] });

    set({ loading: true });
    try {
      const res = await fetch(`/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) set({ orders: data.orders || [] });
      else set({ orders: [] });
    } catch (err) {
      console.error(err);
      set({ orders: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Place a new order
  placeOrder: async ({ items, shippingAddress, paymentMethod, paymentAccountId }) => {
    const { token } = useAuthStore.getState();
    if (!token) return null;

    set({ loading: true });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingAddress, paymentMethod, paymentAccountId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set({ orders: [data.order, ...get().orders] });
        return data.order;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const { token } = useAuthStore.getState();
    if (!token) return false;

    set({ loading: true });
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set({
          orders: get().orders.map((o) => (o._id === orderId ? { ...o, status } : o)),
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
