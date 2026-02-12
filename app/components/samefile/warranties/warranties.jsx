"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react";

import { useWarrantyStore } from "../../../store/warrantyStore";
import { useStoreStore } from "../../../store/store";
import { useAuthStore } from "../../../store/authStore";


export default function WarrantyPage() {
    const router = useRouter();
    const { user, rehydrated } = useAuthStore();
  const {
    warranties,
    fetchWarranties,
    createWarranty,
    updateWarranty,
    deleteWarranty,
    loading,
    error,
  } = useWarrantyStore();

  const { stores, fetchStores } = useStoreStore();

  const [editingId, setEditingId] = useState(null);
  const [storeId, setStoreId] = useState("");
  const [warrantyName, setWarrantyName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState("");

// ==================== AUTH + LOAD DATA ====================
useEffect(() => {
    if (!rehydrated) return;
  
    if (!user || !["admin", "owner"].includes(user.role)) {
      router.push("/login");
      return;
    }
  
    const uId = user.id || user._id;
    if (user.role === "admin") {
      fetchWarranties();
      fetchStores();
    } else {
      fetchWarranties(uId);
      fetchStores(uId);
    }
  }, [rehydrated, user, router, fetchWarranties, fetchStores]);
  

  // ==================== SAVE ====================
  const saveWarranty = async () => {
    if (!storeId || !warrantyName || !startDate || !endDate) {
      return setLocalError("All fields are required");
    }

    const payload = {
      store_id: storeId,
      warranty_name: warrantyName,
      start_date: startDate,
      end_date: endDate,
      status,
    };

    let result;
    if (editingId) {
      result = await updateWarranty({ warrantyId: editingId, ...payload });
    } else {
      result = await createWarranty(payload);
    }

    if (result?.success) resetForm();
    else setLocalError(result?.message || "Something went wrong");
  };

  // ==================== EDIT ====================
  const startEdit = (w) => {
    setEditingId(w._id);
    setStoreId(w.store?._id || w.store_id);
    setWarrantyName(w.warranty_name);
    setStartDate(w.start_date?.slice(0, 10));
    setEndDate(w.end_date?.slice(0, 10));
    setStatus(w.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==================== RESET ====================
  const resetForm = () => {
    setEditingId(null);
    setStoreId("");
    setWarrantyName("");
    setStartDate("");
    setEndDate("");
    setStatus("active");
    setLocalError("");
  };

  // ==================== DELETE ====================
  const handleDelete = async (id) => {
    if (!confirm("Delete this warranty?")) return;
    await deleteWarranty(id);
  };

  // ==================== FILTER ====================
  const filteredWarranties = warranties.filter(
    (w) =>
      w.warranty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.store?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Warranty Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage warranties across stores
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-600" />
            {editingId ? "Edit Warranty" : "Create Warranty"}
          </h2>
          {editingId && (
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Warranty Name" value={warrantyName} onChange={setWarrantyName} />

          <Select
            label="Store"
            value={storeId}
            onChange={setStoreId}
            options={stores.map((s) => ({ value: s._id, label: s.name }))}
          />

          <Input label="Start Date" type="date" value={startDate} onChange={setStartDate} />
          <Input label="End Date" type="date" value={endDate} onChange={setEndDate} />

          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "active", label: "Active" },
              { value: "expired", label: "Expired" },
              { value: "void", label: "Void" },
            ]}
          />

          {/* Actions */}
          <div className="md:col-span-3 flex justify-between items-center pt-4 border-t">
            {(localError || error) && (
              <span className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle size={14} /> {localError || error}
              </span>
            )}
            <div className="flex gap-3 ml-auto">
              {editingId && (
                <button onClick={resetForm} className="px-6 py-2 rounded-xl text-gray-500">
                  Cancel
                </button>
              )}
              <button
                onClick={saveWarranty}
                disabled={loading}
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl flex gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search warranties..."
          className="w-full pl-12 py-3 rounded-2xl border"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-400">
            <tr>
               <th className="px-6 py-4">Warranty</th>
              <th className="px-6 py-4">Store</th>
              {user?.role === "admin" && <th className="px-6 py-4">Owner</th>}
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredWarranties.map((w) => (
    <tr key={w._id} className="border-t hover:bg-gray-50">
      <td className="px-6 py-4 font-medium">{w.warranty_name}</td>
      <td className="px-6 py-4">{w.store?.name || "Unknown"}</td>
      {user?.role === "admin" && <td className="px-6 py-4 text-xs text-gray-500">{w.user?.name || "Unknown"}</td>}
      <td className="px-6 py-4 capitalize">{w.status}</td>
      <td className="px-6 py-4 flex justify-end gap-2">
        <IconBtn onClick={() => startEdit(w)}>
          <Pencil size={16} />
        </IconBtn>
        <IconBtn danger onClick={() => handleDelete(w._id)}>
          <Trash2 size={16} />
        </IconBtn>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
}

/* ==================== SMALL COMPONENTS ==================== */

const Input = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-gray-500">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-gray-50 rounded-xl border"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-gray-500">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-gray-50 rounded-xl border"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const IconBtn = ({ children, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition ${
      danger ? "hover:bg-red-50 text-red-500" : "hover:bg-indigo-50 text-gray-500"
    }`}
  >
    {children}
  </button>
);
