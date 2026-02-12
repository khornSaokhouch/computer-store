import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      rehydrated: false,

      login: async (email, password) => {
        set({ loading: true, error: null });
      
        try {
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "login", email, password }),
          });
      
          const data = await res.json();
      
          if (!res.ok) throw new Error(data.message || "Login failed");
      
          // Save user and token in the store
          set({ user: data.user, token: data.token, loading: false });
      
          // ✅ Return success and role
          return { success: true, role: data.user.role };
        } catch (err) {
          set({ error: err.message, loading: false, user: null, token: null });
          return { success: false, message: err.message };
        }
      },
      

      register: async (name, email, password, confirmPassword) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "register", name, email, password, confirmPassword }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Registration failed");

          set({ loading: false });
          return { success: true };
        } catch (err) {
          set({ error: err.message, loading: false });
          return { success: false, message: err.message };
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      setRehydrated: () => set({ rehydrated: true }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => state?.setRehydrated?.(),
    }
  )
);
