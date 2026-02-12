// store/paymentStore.js
import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const usePaymentAccountStore = create((set, get) => ({
  accounts: [],
  loading: false,

  // Fetch all payment accounts
  fetchAccounts: async (userId = null) => {
    const { token } = useAuthStore.getState();
    if (!token) return set({ accounts: [] });

    set({ loading: true });
    try {
      const query = userId ? `?userId=${userId}` : "";
      const res = await fetch(`/api/admin/paymentAccounts${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        set({ accounts: data.accounts || [] });
      } else {
        console.warn("Failed to fetch accounts:", data.message);
        set({ accounts: [] });
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      set({ accounts: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Add a new payment account
  addAccount: async ({ userName, accountId, type, city, ownerId }) => {
    const { token } = useAuthStore.getState();
    if (!token) return alert("Please login first");

    set({ loading: true });
    try {
      const res = await fetch("/api/admin/paymentAccounts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ userName, accountId, type, city, ownerId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Add the new account to the top of the list
        set({ accounts: [data.account, ...get().accounts] });
        return data.account;
      } else {
        console.warn("Failed to add account:", data.message);
        return null;
      }
    } catch (err) {
      console.error("Error adding account:", err);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // Update account
  updateAccount: async (payload) => {
    const { token } = useAuthStore.getState();
    if (!token) return alert("Please login first");

    set({ loading: true });
    try {
      const res = await fetch("/api/admin/paymentAccounts", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        set((state) => ({
          accounts: state.accounts.map((a) => (a._id === payload.id ? data.account : a)),
        }));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ loading: false });
    }
  },

  // Delete account
  deleteAccount: async (id) => {
    const { token } = useAuthStore.getState();
    set({ loading: true });
    try {
      const res = await fetch(`/api/admin/paymentAccounts?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        set((state) => ({
          accounts: state.accounts.filter((a) => a._id !== id),
        }));
        return { success: true };
      } else {
         return { success: false, message: data.message };
      }
    } catch (err) {
       return { success: false, message: err.message };
    } finally {
      set({ loading: false });
    }
  },

  // Get account by ID (from state)
  getAccountById: (id) => {
    return get().accounts.find((a) => a._id === id) || null;
  },

  // Fetch specific account by ID (API call)
  fetchAccountById: async (id) => {
    const { token } = useAuthStore.getState();
    // Allow fetching without token if public logic is implemented, but for now assuming authenticated buyer
    if (!token) return null; 

    try {
      const res = await fetch(`/api/admin/paymentAccounts?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data.account;
      }
      return null;
    } catch (err) {
      console.error("Error fetching account:", err);
      return null;
    }
  },
}));
