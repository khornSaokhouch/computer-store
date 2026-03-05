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
  Plus,
  Calendar,
  Store as StoreIcon,
  User as UserIcon,
  Clock,
  ChevronRight
} from "lucide-react";

import { useWarrantyStore } from "../../../store/warrantyStore";
import { useStoreStore } from "../../../store/store";
import { useAuthStore } from "../../../store/authStore";

export default function WarrantyPage() {
  const router = useRouter();
  const { user, rehydrated } = useAuthStore();
  const { warranties, fetchWarranties, createWarranty, updateWarranty, deleteWarranty, loading, error } = useWarrantyStore();
  const { stores, fetchStores } = useStoreStore();

  const [editingId, setEditingId] = useState(null);
  const [storeId, setStoreId] = useState("");
  const [warrantyName, setWarrantyName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState("");
  const [showForm, setShowForm] = useState(false);

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

  const saveWarranty = async () => {
    if (!storeId || !warrantyName || !startDate || !endDate) {
      return setLocalError("All fields are required to register a warranty.");
    }
    const payload = { store_id: storeId, warranty_name: warrantyName, start_date: startDate, end_date: endDate, status };
    let result = editingId ? await updateWarranty({ warrantyId: editingId, ...payload }) : await createWarranty(payload);
    if (result?.success) resetForm();
    else setLocalError(result?.message || "Operation failed.");
  };

  const startEdit = (w) => {
    setEditingId(w._id);
    setStoreId(w.store?._id || w.store_id);
    setWarrantyName(w.warranty_name);
    setStartDate(w.start_date?.slice(0, 10));
    setEndDate(w.end_date?.slice(0, 10));
    setStatus(w.status);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setStoreId("");
    setWarrantyName("");
    setStartDate("");
    setEndDate("");
    setStatus("active");
    setLocalError("");
    setShowForm(false);
  };

  const filteredWarranties = warranties.filter(
    (w) =>
      w.warranty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.store?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (s) => {
    switch (s) {
      case "active": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "expired": return "bg-slate-50 text-slate-500 border-slate-200";
      case "void": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-gray-50 text-gray-400";
    }
  };

  if (!rehydrated) return null;

  return (
    <div className="font-sans max-w-[1400px] mx-auto pb-20 space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Warranties</h1>
          <p className="text-slate-500 font-medium mt-2">Manage consumer protection plans and validity periods.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); if(showForm) resetForm(); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            showForm ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Close Form' : 'Register Warranty'}
        </button>
      </div>

      {/* FORM SECTION */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">
                {editingId ? "Modify Warranty Plan" : "Create Protection Plan"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Input label="Warranty Title" placeholder="e.g. 1 Year Apple Care" value={warrantyName} onChange={setWarrantyName} />
              
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign to Store</label>
                <div className="relative">
                  <StoreIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select Store</option>
                    {stores.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="void">Void</option>
                </select>
              </div>

              <Input label="Effective Date" type="date" value={startDate} onChange={setStartDate} />
              <Input label="Expiration Date" type="date" value={endDate} onChange={setEndDate} />

              <div className="flex items-end justify-end pb-1">
                <button 
                  onClick={saveWarranty} 
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl disabled:bg-slate-200"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : (editingId ? "Save Changes" : "Confirm Warranty")}
                </button>
              </div>
            </div>

            {localError && (
              <p className="mt-6 text-rose-500 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={14}/> {localError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* SEARCH & LISTING */}
      <div className="space-y-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by plan name or store..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
          />
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Warranty Plan</th>
                  <th className="px-8 py-5 text-center">Duration</th>
                  <th className="px-8 py-5">Associated Store</th>
                  {user?.role === "admin" && <th className="px-8 py-5">Merchant Store</th>}
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredWarranties.map((w) => (
                  <tr key={w._id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <ShieldCheck size={20} />
                        </div>
                        <p className="text-sm font-black text-slate-900 leading-none">{w.warranty_name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <p className="text-[11px] font-bold text-slate-700">
                          {new Date(w.start_date).toLocaleDateString()}
                        </p>
                        <ChevronRight size={10} className="rotate-90 text-slate-300 my-0.5" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase">
                          {new Date(w.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <StoreIcon size={14} className="text-indigo-500" />
                        <span className="text-[11px] font-bold text-slate-600 uppercase">{w.store?.name || "Global"}</span>
                      </div>
                    </td>
                    {user?.role === "admin" && (
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <UserIcon size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-700">{w.user?.name || "System"}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(w.status)}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(w)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteWarranty(w._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredWarranties.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-medium italic">
              No warranty records indexed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Custom Input Component
const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {type === 'date' && <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${type === 'date' ? 'pl-11' : 'px-5'} py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
      />
    </div>
  </div>
);