"use client";
import { useEffect, useState, useRef } from "react";
import { 
  Plus, X, Loader2, AlertCircle, Search, Pencil, 
  Trash2, MapPin, Mail, Phone, Store as StoreIcon,
  UploadCloud, ArrowUpRight, ChevronRight
} from "lucide-react";
import { useStoreStore } from "../../../store/store";
import { useAuthStore } from "../../../store/authStore";

export default function StorePage() {
  const { user, rehydrated } = useAuthStore();
  const { stores, fetchStores, createStore, updateStore, deleteStore, loading, error } = useStoreStore();

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [image, setImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fileInputRef = useRef();

  useEffect(() => {
    if (!rehydrated || !user) return;
    if (user.role === "admin") fetchStores(); 
    else if (user.role === "owner") fetchStores(user.id);
  }, [rehydrated, user, fetchStores]);

  useEffect(() => {
    if (editingId) {
      const store = stores.find((s) => s._id === editingId);
      if (store) {
        setName(store.name || "");
        setLocation(store.location || "");
        setContactEmail(store.contact_email || "");
        setContactPhone(store.contact_phone || "");
        setImage(store.image || "");
        setShowForm(true);
      }
    }
  }, [editingId, stores]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setLocation("");
    setContactEmail("");
    setContactPhone("");
    setImage("");
    setLocalError("");
    setShowForm(false);
  };

  const saveStore = async () => {
    if (!name.trim()) return setLocalError("Store name is required");
    const payload = { name, location, contact_email: contactEmail, contact_phone: contactPhone, image, id: editingId };
    const result = editingId ? await updateStore(payload) : await createStore(payload);
    if (result?.success) resetForm();
    else setLocalError(result?.message || "Something went wrong");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!rehydrated) return null;

  return (
    <div className="font-sans pb-20 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Stores</h1>
          <p className="text-slate-500 font-medium mt-2">
            {user?.role === 'admin' ? 'Global distribution network management' : 'Manage your business branch locations'}
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            showForm ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Close Form' : 'Register Store'}
        </button>
      </div>

      {/* FORM SECTION (COLLAPSIBLE) */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="p-8 lg:p-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <StoreIcon size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">
                {editingId ? "Edit Location Info" : "New Location Entry"}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Image Column */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Branding</p>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="group relative h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all overflow-hidden"
                >
                  {image ? (
                    <>
                      <img src={image} className="w-full h-full object-cover" alt="preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <UploadCloud size={32} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-indigo-600 transition-colors">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-xs font-bold text-slate-600">Drop storefront image</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              </div>

              {/* Fields Columns */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                <Input label="Business Name" placeholder="e.g. TECH.AD North Hub" value={name} onChange={setName} />
                <Input label="Region / City" placeholder="e.g. Phnom Penh" value={location} onChange={setLocation} />
                <Input label="Contact Email" placeholder="hq@store.com" value={contactEmail} onChange={setContactEmail} />
                <Input label="Support Phone" placeholder="+855 00 000 000" value={contactPhone} onChange={setContactPhone} />
                
                <div className="md:col-span-2 pt-6 flex items-center justify-between border-t border-slate-50 mt-4">
                  <p className="text-rose-500 text-xs font-bold">{(localError || error) && <span className="flex items-center gap-1"><AlertCircle size={14}/> {localError || error}</span>}</p>
                  <div className="flex gap-4">
                    <button onClick={resetForm} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                    <button 
                      onClick={saveStore} 
                      disabled={loading || !name}
                      className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg disabled:bg-slate-200"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : (editingId ? "Update Branch" : "Confirm Entry")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER & LISTING SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Filter by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
             Total Operations: <span className="text-indigo-600 ml-1">{filteredStores.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Branch Entity</th>
                  <th className="px-8 py-5">Location</th>
                  <th className="px-8 py-5">Communication</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStores.map((s) => (
                  <tr key={s._id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6 flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 relative">
                         {s.image ? (
                           <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                         ) : (
                           <StoreIcon className="m-auto mt-4 text-slate-300" size={24} />
                         )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{s.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">UID: {s._id.slice(-8)}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={14} className="text-indigo-500" />
                        <span className="text-[11px] font-bold uppercase">{s.location || "Central Region"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <Mail size={12} className="text-slate-400" /> {s.contact_email}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                          <Phone size={11} /> {s.contact_phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingId(s._id)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteStore(s._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStores.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-medium italic">
              No store records found in the database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Minimalist Form Input Component
const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
    />
  </div>
);