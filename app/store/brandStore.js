import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useBrandStore = create((set, get) => ({
  brands: [],
  brand: null,
  loading: false,
  error: null,

  // ===== FETCH ALL BRANDS =====
  fetchBrands: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch brands");
      }

      set({ brands: data.brands, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ===== FETCH SINGLE BRAND =====
  fetchBrandById: async (brandId) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/admin/brands?brandId=${brandId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch brand");
      }

      set({ brand: data.brand, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ===== CREATE BRAND (ADMIN) =====
  createBrand: async ({ name }) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create brand");
      }

      set((state) => ({
        brands: [data.brand, ...state.brands],
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ===== UPDATE BRAND (ADMIN) =====
  updateBrand: async ({ brandId, name }) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch("/api/admin/brands", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ brandId, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update brand");
      }

      set((state) => ({
        brands: state.brands.map((b) =>
          b.id === brandId ? data.brand : b
        ),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ===== DELETE BRAND (ADMIN) =====
  deleteBrand: async (brandId) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch(`/api/admin/brands?brandId=${brandId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete brand");
      }

      set((state) => ({
        brands: state.brands.filter((b) => b.id !== brandId),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ===== CLEAR STORE =====
  clearBrands: () =>
    set({ brands: [], brand: null, error: null }),
}));
