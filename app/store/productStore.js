import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useProductStore = create((set, get) => ({
  products: [],
  totalProducts: 0,
  loading: false,
  error: null,

  // Filters
  filters: {
    search: "",
    category: "",
    brand: "", // NEW
    type: "",
    store: "", // NEW: Filter by store ID
  },

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  // Fetch all products with filters
  fetchProducts: async (userId = null) => {
    const { filters } = get();
    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams();

      if (userId) params.append("userId", userId); // <-- Filter by user ID if provided

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const queryString = params.toString();
      const res = await fetch(`/api/admin/products${queryString ? `?${queryString}` : ""}`);
      const data = await res.json();

      if (res.ok && data.success) {
        set({
          products: data.products || [],
          totalProducts: (data.products || []).length,
          loading: false,
        });
      } else {
        set({ error: data.message || "Failed to fetch products", loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/admin/products?id=${id}`);
      const data = await res.json();

      if (data.success) {
        set({ loading: false });
        return data.product;
      } else {
        set({ error: data.message, loading: false });
        return null;
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  // ------------------------
  // Admin Actions
  // ------------------------

  createProduct: async (payload) => {
    const token = useAuthStore.getState().token;

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) get().fetchProducts();
    return data;
  },

  updateProduct: async (payload) => {
    const token = useAuthStore.getState().token;

    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) get().fetchProducts();
    return data;
  },

  deleteProduct: async (id) => {
    const token = useAuthStore.getState().token;

    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) {
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        totalProducts: state.totalProducts - 1,
      }));
    }
    return data;
  },

  resetFilters: () =>
    set({ filters: { search: "", category: "", brand: "", type: "", store: "" } }),
}));
