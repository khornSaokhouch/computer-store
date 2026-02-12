import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  category: null,
  loading: false,
  error: null,

  // ===== FETCH ALL CATEGORIES =====
  fetchCategories: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      set({ categories: data.categories, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ===== FETCH SINGLE CATEGORY =====
  fetchCategoryById: async (categoryId) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/admin/categories?categoryId=${categoryId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch category");
      }

      set({ category: data.category, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ===== CREATE CATEGORY (ADMIN) =====
  createCategory: async ({ category_name, description, imageBase64 }) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category_name, description, imageBase64 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      set((state) => ({
        categories: [data.category, ...state.categories],
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ===== UPDATE CATEGORY (ADMIN) =====
  updateCategory: async ({ categoryId, category_name, description, imageBase64 }) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId,
          category_name,
          description,
          imageBase64,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === categoryId ? data.category : c
        ),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ===== DELETE CATEGORY (ADMIN) =====
  deleteCategory: async (categoryId) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch(`/api/admin/categories?categoryId=${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  // ===== CLEAR STORE =====
  clearCategories: () =>
    set({ categories: [], category: null, error: null }),
}));
