import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useFavoriteStore = create((set, get) => ({
  favorites: [],
  loading: false,

  // Fetch favorites for the logged-in user
  fetchFavorites: async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ favorites: [] });
      return;
    }

    set({ loading: true });
    try {
      const res = await fetch("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Token invalid, log out user
          useAuthStore.getState().logout();
        }
        set({ favorites: [] });
      } else {
        set({ favorites: data.favorites || [] });
      }
    } catch {
      set({ favorites: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Check if a product is in favorites
  isFavorite: (productId) => {
    if (!productId) return false;
    return get().favorites.some((fav) => {
      const favProductId = fav.product?._id || fav.product;
      return favProductId?.toString() === productId.toString();
    });
  },

  // Toggle favorite with optimistic update
  toggleFavorite: async (product) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    const productId = product._id;
    const currentFavorites = get().favorites;

    const existing = currentFavorites.find((fav) => {
      const favProductId = fav.product?._id || fav.product;
      return favProductId?.toString() === productId.toString();
    });

    if (existing) {
      // Remove favorite optimistically
      set({ favorites: currentFavorites.filter((f) => f._id !== existing._id) });

      try {
        const res = await fetch(`/api/favorites?id=${existing._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) get().fetchFavorites(); // rollback on error
      } catch {
        get().fetchFavorites(); // rollback on error
      }
    } else {
      // Add favorite optimistically
      const tempId = Date.now().toString();
      const tempEntry = { _id: tempId, product: { _id: productId, ...product } };
      set({ favorites: [...currentFavorites, tempEntry] });

      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product: productId }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          set({
            favorites: get().favorites.map((f) =>
              f._id === tempId ? data.favorite : f
            ),
          });
        } else {
          get().fetchFavorites(); // rollback on error
        }
      } catch {
        get().fetchFavorites(); // rollback on error
      }
    }
  },
}));
