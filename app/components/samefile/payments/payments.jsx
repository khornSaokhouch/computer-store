"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Plus
} from "lucide-react";
import { usePaymentAccountStore } from "../../../store/paymentAccountStore";
import { useAuthStore } from "../../../store/authStore";
import { useRouter } from "next/navigation";

export default function PaymentAccountsPage() {
  const router = useRouter();
  const { user, rehydrated } = useAuthStore();
  
  const { 
    accounts, 
    loading, 
    fetchAccounts, 
    addAccount, 
    updateAccount, 
    deleteAccount 
  } = usePaymentAccountStore();

  const [form, setForm] = useState({
    userName: "",
    accountId: "",
    type: "",
    city: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!rehydrated) return;
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      router.push("/login");
      return;
    }
    fetchAccounts();
  }, [rehydrated, user, fetchAccounts, router]);

  const resetForm = () => {
    setForm({ userName: "", accountId: "", type: "", city: "" });
    setEditingId(null);
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Just in case, though button type is button by default if not specified
    if (!form.userName || !form.accountId || !form.type || !form.city) {
      return setLocalError("All fields are required");
    }

    let result;
    if (editingId) {
      result = await updateAccount({ id: editingId, ...form });
    } else {
      result = await addAccount(form);
    } // addAccount returns account obj or null. Adapter needed?
      // Store `addAccount` returns `data.account` (truthy) or `null`.
      // Store `updateAccount` returns `{ success: true }`.
      // I should standardize or handle both.
      
      // Let's check store: 
      // addAccount: returns object or null.
      // updateAccount: returns { success: true/false }

    if (editingId) {
        if (result && result.success) resetForm();
        else setLocalError(result?.message || "Failed to update");
    } else {
        if (result) resetForm(); // addAccount returns the object on success
        else setLocalError("Failed to create account");
    }
  };

  const startEdit = (acc) => {
    setEditingId(acc._id);
    setForm({
      userName: acc.userName || "",
      accountId: acc.accountId || "",
      type: acc.type || "",
      city: acc.city || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    await deleteAccount(id);
  };

  const filteredAccounts = accounts.filter(
    (a) =>
      a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Accounts</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your Bakong and bank accounts for receiving payments.
          </p>
        </div>
      </div>

      {/* 1. CREATE / EDIT FORM */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
        <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <CreditCard size={18} className="text-indigo-600" />
            {editingId ? "Edit Account" : "Add New Account"}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* User Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">Account Name</label>
              <input
                type="text"
                placeholder="e.g. My Shop KHQR"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
              />
            </div>

            {/* Account ID */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">Bakong ID</label>
              <input
                type="text"
                placeholder="e.g. myshop@aca"
                value={form.accountId}
                onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
              >
                <option value="">Select Type</option>
                <option value="Bakong">Bakong</option>
              </select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">City</label>
              <input
                type="text"
                placeholder="e.g. Phnom Penh"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Error + Actions */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-50">
            <div className="flex items-center gap-2">
              {localError && (
                <span className="text-red-500 text-xs font-medium flex items-center gap-1">
                  <AlertCircle size={14} /> {localError}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {editingId && (
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all text-sm"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {editingId ? "Update Account" : "Save Account"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative w-full md:w-96 group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Filter accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
        />
      </div>

      {/* 3. ACCOUNTS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Account Name
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Bakong ID
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Type
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                City
              </th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Actions
              </th>
              {user?.role === "admin" && (
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Owner
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredAccounts.map((acc) => (
              <tr
                key={acc._id}
                className="hover:bg-indigo-50/5 transition-colors group"
              >
                <td className="px-8 py-4 font-bold text-gray-800">{acc.userName}</td>
                <td className="px-8 py-4 text-gray-600">{acc.accountId}</td>
                <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                        {acc.type}
                    </span>
                </td>
                <td className="px-8 py-4 text-gray-600">{acc.city}</td>
                <td className="px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(acc)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(acc._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
                {user?.role === "admin" && (
                  <td className="px-8 py-4 border-l border-gray-50 bg-gray-50/30">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">
                        {acc.owner?.name || (typeof acc.owner === 'string' ? "ID: " + acc.owner.slice(-6) : "System")}
                      </span>
                      {acc.owner?.email && (
                        <span className="text-[10px] text-gray-400 font-medium">{acc.owner.email}</span>
                      )}
                    </div>
                  </td>
                )}
                </tr>
            ))}
          </tbody>
        </table>

        {filteredAccounts.length === 0 && (
            <div className="py-20 text-center">
            <p className="text-gray-400 text-sm italic">
                No payment accounts found.
            </p>
            </div>
        )}
      </div>
    </div>
  );
}
