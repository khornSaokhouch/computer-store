import { create } from "zustand";

export const useCheckMd5Store = create((set, get) => ({
  isPaid: false,
  statusLoading: false,
  pollIntervalId: null,
  attempts: 0,

  resetStatus: () => {
    const { pollIntervalId } = get();
    if (pollIntervalId) clearInterval(pollIntervalId);

    set({
      isPaid: false,
      statusLoading: false,
      pollIntervalId: null,
      attempts: 0,
    });
  },

  startPolling: (md5, onSuccess) => {
    // Prevent multiple intervals
    const existing = get().pollIntervalId;
    if (existing) clearInterval(existing);

    set({
      isPaid: false,
      statusLoading: true,
      attempts: 0,
    });

    const intervalId = setInterval(async () => {
      try {
        const { attempts } = get();

        // ⛔ Stop after 20 tries (~1 minute)
        if (attempts >= 20) {
          clearInterval(intervalId);
          set({ statusLoading: false, pollIntervalId: null });
          return;
        }

        set({ attempts: attempts + 1 });

        const res = await fetch("/api/bakong/check-md5", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ md5 }),
        });

        const data = await res.json();

        if (data.success && data.data?.status === "paid") {
          clearInterval(intervalId);
          set({
            isPaid: true,
            statusLoading: false,
            pollIntervalId: null,
          });

          if (onSuccess) onSuccess(data);
        }

      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    set({ pollIntervalId: intervalId });
  },
}));
