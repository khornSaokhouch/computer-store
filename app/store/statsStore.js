import { create } from "zustand";
// Stats Store for Admin Dashboard
export const useStatsStore = create((set, get) => ({
  // State
  stats: null,
  loading: false,
  error: null,

  // Fetch stats from API
  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiCall("/api/admin/stats");
      if (data.success) {
        set({ stats: data.stats, loading: false });
      } else {
        set({ error: data.message || "Failed to fetch stats", loading: false });
      }
    } catch (err) {
      console.error("❌ fetchStats error:", err);
      set({ error: err.message, loading: false });
    }
  },

  // Clear stats (optional)
  clearStats: () => set({ stats: null, error: null, loading: false }),
}));
