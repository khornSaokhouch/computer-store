// store/paymentStore.js
import { create } from "zustand";

export const usePaymentStore = create((set, get) => ({
  loading: false,
  paymentUrl: null,
  qrCode: null,
  error: null,

  /**
   * Generate Bakong QR / Payment
   * @param {string} orderId
   * @returns {object|null} { qrCode, paymentUrl } or null on failure
   */
  createPayment: async (params) => {
    const { orderId, amount, paymentAccountId } = params || {};
    
    if (!orderId && (!amount || !paymentAccountId)) {
      set({ error: "Order ID or Amount/Account are required" });
      return null;
    }

    set({ loading: true, qrCode: null, paymentUrl: null, error: null });

    try {
      const res = await fetch("/api/bakong/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount, paymentAccountId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        set({ error: data.message || "Payment failed", loading: false });
        return null;
      }

      // Update store state
      set({
        qrCode: data.qrCode || null,
        paymentUrl: data.paymentUrl || null,
        md5: data.md5 || null,
        loading: false,
        error: null,
      });

      // Return the data for immediate use in component
      return {
        qrCode: data.qrCode || null,
        paymentUrl: data.paymentUrl || null,
        md5: data.md5 || null,
      };
    } catch (err) {
      console.error("Error creating payment:", err);
      set({ error: err.message || "Something went wrong", loading: false });
      return null;
    }
  },

  /**
   * Reset payment store state
   */
  resetPayment: () => {
    set({ qrCode: null, paymentUrl: null, error: null, loading: false });
  },
}));
