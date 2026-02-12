import { create } from "zustand";

export const useCheckMd5Store = create((set) => ({
  isPaid: false,
  statusLoading: false,

  resetStatus: () => set({ isPaid: false, statusLoading: false }),

  startPolling: (md5, onSuccess) => {
    set({ isPaid: false, statusLoading: true });

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/bakong/check-md5", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ md5 }),
        });

        const data = await res.json();

        if (data.success) {
          clearInterval(interval);
          set({ isPaid: true, statusLoading: false });
          if (onSuccess) onSuccess();
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  },
}));