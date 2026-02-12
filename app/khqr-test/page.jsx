"use client";

import { useState } from "react";

export default function KHQRTestPage() {
  const [form, setForm] = useState({
    bakongAccountID: "jonhsmith@nbcq",
    merchantName: "Jonh Smith",
    merchantCity: "PHNOM PENH",
    currency: "KHR",
    amount: 500
  });

  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setQrData(null);

    try {
      const res = await fetch("/api/bakong/khqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setQrData(data);
    } catch {
      alert("Failed to generate KHQR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-center">
          Bakong KHQR Test
        </h1>

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Bakong Account ID"
          value={form.bakongAccountID}
          onChange={(e) =>
            setForm({ ...form, bakongAccountID: e.target.value })
          }
        />

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Merchant Name"
          value={form.merchantName}
          onChange={(e) =>
            setForm({ ...form, merchantName: e.target.value })
          }
        />

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Merchant City"
          value={form.merchantCity}
          onChange={(e) =>
            setForm({ ...form, merchantCity: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          placeholder="Amount (KHR)"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: Number(e.target.value) })
          }
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded font-bold"
        >
          {loading ? "Generating..." : "Generate KHQR"}
        </button>

        {qrData && (
          <div className="text-center border-t pt-4">
            <img src={qrData.qrCode} className="mx-auto w-48" />
            <p className="text-xs break-all text-gray-500 mt-2">
              {qrData.khqrString}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
