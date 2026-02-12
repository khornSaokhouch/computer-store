// store.js (your Zustand store for CRUD)
import { create } from "zustand";

// ✅ Import the auth store
import { useAuthStore } from "./authStore"; // Adjust path if needed

export const useStoreStore = create((set, get) => ({
  stores: [],
  loading: false,
  error: null,
  store: null, // NEW: Single store details

  fetchStoreById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/stores?id=${id}`);
      const data = await res.json();
      if (data.success) {
        set({ store: data.store, loading: false });
        return data.store;
      } else {
        set({ error: data.message, loading: false });
        return null;
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  fetchStores: async (userId = null) => {
    const { token } = useAuthStore.getState(); 
    set({ loading: true, error: null });
    try {
      const query = userId ? `?userId=${userId}` : "";
      const res = await fetch(`/api/admin/stores${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) set({ stores: data.stores, loading: false });
      else set({ error: data.message, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createStore: async (store) => {
    const { token } = useAuthStore.getState();
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(store),
      });
      const data = await res.json();
      if (data.success) {
        set({ stores: [data.store, ...get().stores], loading: false });
        return { success: true };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // Update and delete can also use token
  updateStore: async (store) => {
    const { token } = useAuthStore.getState();
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/admin/stores", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(store),
      });
      const data = await res.json();
      if (data.success) {
        const updatedStores = get().stores.map((s) => (s._id === data.store._id ? data.store : s));
        set({ stores: updatedStores, loading: false });
        return { success: true };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  deleteStore: async (id) => {
    const { token } = useAuthStore.getState();
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/stores?id=${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        set({ stores: get().stores.filter((s) => s._id !== id), loading: false });
        return { success: true };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },
}));
