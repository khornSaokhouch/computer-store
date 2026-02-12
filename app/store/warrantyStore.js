import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useWarrantyStore = create((set, get) => ({
  warranties: [],
  loading: false,
  error: null,

  // ==================== FETCH ALL / SINGLE ====================
  // ==================== FETCH ALL ====================
  fetchWarranties: async (userId = null) => {
    const { token } = useAuthStore.getState();

    set({ loading: true, error: null });
    try {
      const url = userId
        ? `/api/admin/warranties?userId=${userId}`
        : `/api/admin/warranties`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ warranties: data.warranties, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ==================== CREATE ====================
  createWarranty: async (payload) => {
    const { token } = useAuthStore.getState();

    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/admin/warranties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({
        warranties: [data.warranty, ...get().warranties],
        loading: false,
      });

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ==================== UPDATE ====================
  updateWarranty: async (payload) => {
    const { token } = useAuthStore.getState();

    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/admin/warranties", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const updated = get().warranties.map((w) =>
        w._id === data.warranty._id ? data.warranty : w
      );

      set({ warranties: updated, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ==================== DELETE ====================
  deleteWarranty: async (warrantyId) => {
    const { token } = useAuthStore.getState();

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/admin/warranties?warrantyId=${warrantyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({
        warranties: get().warranties.filter((w) => w._id !== warrantyId),
        loading: false,
      });

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },
}));
