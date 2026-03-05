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
  Plus,
  Building2,
  Globe,
  User as UserIcon,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { usePaymentAccountStore } from "../../../store/paymentAccountStore";
import { useAuthStore } from "../../../store/authStore";
import { useRouter } from "next/navigation";

export default function PaymentAccountsPage() {
  const router = useRouter();
  const { user, rehydrated } = useAuthStore();
  const { accounts, loading, fetchAccounts, addAccount, updateAccount, deleteAccount } = usePaymentAccountStore();

  const [form, setForm] = useState({ userName: "", accountId: "", type: "", city: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState("");
  const [showForm, setShowForm] = useState(false);

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
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    if (!form.userName || !form.accountId || !form.type || !form.city) {
      return setLocalError("Please fill in all settlement details.");
    }

    let result = editingId 
      ? await updateAccount({ id: editingId, ...form }) 
      : await addAccount(form);

    if (result) resetForm();
    else setLocalError("Transaction failed. Please check your inputs.");
  };

  const startEdit = (acc) => {
    setEditingId(acc._id);
    setForm({
      userName: acc.userName || "",
      accountId: acc.accountId || "",
      type: acc.type || "",
      city: acc.city || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredAccounts = accounts.filter(
    (a) =>
      a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!rehydrated) return null;

  return (
    <div className="font-sans max-w-[1400px] mx-auto pb-20 space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Settlements</h1>
          <p className="text-slate-500 font-medium mt-2">Manage your Bakong and bank accounts for receiving customer payments.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); if(showForm) resetForm(); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            showForm ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'Add Account'}
        </button>
      </div>

      {/* FORM SECTION (COLLAPSIBLE) */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="p-8 lg:p-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm">
                <CreditCard size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">
                {editingId ? "Modify Account" : "Register Settlement Account"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input label="Account Name" icon={UserIcon} placeholder="e.g. Sokha Electronics" value={form.userName} onChange={(v) => setForm({...form, userName: v})} />
              <Input label="Bakong ID / Number" icon={ShieldCheck} placeholder="myshop@aba" value={form.accountId} onChange={(v) => setForm({...form, accountId: v})} />
              
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Type</label>
                <div className="relative">
                   <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">Select Platform</option>
                    <option value="Bakong">Bakong (KHQR)</option>
                    <option value="Bank">Direct Bank Transfer</option>
                  </select>
                </div>
              </div>

              <Input label="City/Branch" icon={Globe} placeholder="Phnom Penh" value={form.city} onChange={(v) => setForm({...form, city: v})} />
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-4">
              <p className="text-rose-500 text-xs font-bold">
                {localError && <span className="flex items-center gap-2"><AlertCircle size={14}/> {localError}</span>}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl disabled:bg-slate-200"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : (editingId ? "Update Account" : "Save Settlement")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER & LISTING */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Settlement Entity</th>
                  <th className="px-8 py-5">Bakong / Account ID</th>
                  <th className="px-8 py-5">Platform Type</th>
                  <th className="px-8 py-5">Location</th>
                  {user?.role === "admin" && <th className="px-8 py-5">Merchant Store</th>}
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAccounts.map((acc) => (
                  <tr key={acc._id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                          {acc.userName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{acc.userName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Settlement Primary</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-600">{acc.accountId}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        acc.type === 'Bakong' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-500">{acc.city}</p>
                    </td>
                    {user?.role === "admin" && (
                      <td className="px-8 py-6">
                        <p className="text-xs font-bold text-indigo-600">{acc.owner?.name || "System"}</p>
                        <p className="text-[10px] text-slate-400">{acc.owner?.email}</p>
                      </td>
                    )}
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(acc)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteAccount(acc._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAccounts.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-medium italic">
              No financial accounts linked yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper: Custom Input with Icon
const Input = ({ label, value, onChange, placeholder, icon: Icon }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
      />
    </div>
  </div>
);