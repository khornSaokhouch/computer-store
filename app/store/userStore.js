import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useUserStore = create((set, get) => ({
  users: [],
  totalUsers: 0,
  totalOwners: 0,
  loading: false,
  error: null,

  // Helper function to recalculate counts locally
  // This ensures the counts are always in sync with the current 'users' array
  updateCounts: (usersArray) => {
    set({
      totalUsers: usersArray.length,
      totalOwners: usersArray.filter((u) => u.role === "admin").length,
    });
  },

  // ===== GET ALL USERS =====
  fetchUsers: async () => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      set({ users: data.users, loading: false });
      
      // Update counts after fetching
      get().updateCounts(data.users);
      
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ===== UPDATE USER ROLE =====
  updateUserRole: async (userId, role) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      set((state) => {
        const updatedUsers = state.users.map((u) =>
          u._id === userId ? data.user : u
        );
        
        // Recalculate owners count because a role might have changed
        const newOwnerCount = updatedUsers.filter(u => u.role === "owner").length;

        return { 
          users: updatedUsers, 
          totalOwners: newOwnerCount,
          loading: false 
        };
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ===== DELETE USER =====
  deleteUser: async (userId) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      set((state) => {
        const filteredUsers = state.users.filter((u) => u._id !== userId);
        return {
          users: filteredUsers,
          totalUsers: filteredUsers.length,
          totalOwners: filteredUsers.filter(u => u.role === "owner").length,
          loading: false,
        };
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ===== CLEAR STORE =====
  clearUsers: () => set({ users: [], totalUsers: 0, totalOwners: 0, error: null }),
}));