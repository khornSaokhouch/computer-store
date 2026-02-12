import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useTypeStore = create((set, get) => ({
  types: [],
  type: null,
  loading: false,
  error: null,

  // ===== FETCH ALL TYPES =====
  fetchTypes: async (categoryId = "") => {
    set({ loading: true, error: null });

    try {
      let url = "/api/admin/types";
      if (categoryId) url += `?categoryId=${categoryId}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch types");
      }

      set({ types: data.types || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ===== FETCH SINGLE TYPE =====
  fetchTypeById: async (typeId) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/admin/types?typeId=${typeId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch type");
      }

      set({ type: data.type, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ===== CREATE TYPE (ADMIN) =====
  createType: async ({ type_name, category_id, description }) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch("/api/admin/types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type_name, category_id, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create type");
      }

      set((state) => ({
        types: [data.type, ...state.types],
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ===== UPDATE TYPE (ADMIN) =====
  updateType: async ({ typeId, type_name, category_id, description }) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch("/api/admin/types", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ typeId, type_name, category_id, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update type");
      }

      set((state) => ({
        types: state.types.map((t) =>
          t._id === typeId ? data.type : t
        ),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ===== DELETE TYPE (ADMIN) =====
  deleteType: async (typeId) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch(`/api/admin/types?typeId=${typeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete type");
      }

      set((state) => ({
        types: state.types.filter((t) => t._id !== typeId),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ===== CLEAR STORE =====
  clearTypes: () => set({ types: [], type: null, error: null }),
}));
