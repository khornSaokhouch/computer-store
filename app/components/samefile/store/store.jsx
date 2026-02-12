"use client";
import { useEffect, useState, useRef } from "react";
import { Plus, X, Loader2, AlertCircle, Search, Pencil, Trash2 } from "lucide-react";
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

  const fileInputRef = useRef();

  // Fetch stores based on role
  useEffect(() => {
    if (!rehydrated || !user) return;
    
    // Admin sees all, Owner sees theirs
    if (user.role === "admin") {
      fetchStores(); 
    } else if (user.role === "owner") {
      fetchStores(user.id);
    }
  }, [rehydrated, user, fetchStores]);

  // Populate form when editing
  useEffect(() => {
    if (editingId) {
      const store = stores.find((s) => s._id === editingId);
      if (store) {
        setName(store.name || "");
        setLocation(store.location || "");
        setContactEmail(store.contact_email || "");
        setContactPhone(store.contact_phone || "");
        setImage(store.image || "");
      }
    } else {
      resetForm();
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
  };

  const cancelEdit = () => resetForm();

  // Create / Update
  const saveStore = async () => {
    if (!name.trim()) return setLocalError("Store name is required");
    const payload = { name, location, contact_email: contactEmail, contact_phone: contactPhone, image, id: editingId };
    const result = editingId ? await updateStore(payload) : await createStore(payload);
    if (result?.success) resetForm();
    else setLocalError(result?.message || "Something went wrong");
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this store?")) return;
    await deleteStore(id);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => setImage("");

  // Filter stores locally by search term
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!rehydrated) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Store Management</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
             {user?.role === 'admin' ? 'Manage All Partner Stores' : 'Manage Your Store Locations'}
          </p>
        </div>
      </div>

      {/* CREATE / EDIT FORM */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all">
        <div className="px-10 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Plus size={14} className="text-indigo-600" />
            {editingId ? "Update Store Details" : "Register New Store"}
          </h2>
          {editingId && (
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Awesome Shop"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-bold"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Phnom Penh, Cambodia"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-bold"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="store@example.com"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-bold"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+855 12 345 678"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-bold"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Branding</label>
            <div className="flex items-center gap-6">
              {image ? (
                <div className="relative w-32 h-32 border border-gray-100 rounded-2xl overflow-hidden shadow-sm group">
                  <img src={image} alt="Store" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-600 transition-colors bg-gray-50/50"
                >
                  <Plus size={24} className="mb-1"/>
                  <span className="text-[10px] font-bold uppercase">Upload</span>
                </button>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <div className="text-xs text-gray-400 font-medium">
                Upload your store logo or storefront image.<br/>
                Recommended size: 500x500px.
              </div>
            </div>
          </div>

          {/* Error + Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-50">
            <div>
              {(localError || error) && (
                <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-rose-100">
                  <AlertCircle size={14} /> {localError || error}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={saveStore}
                disabled={loading || !name}
                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all text-xs tracking-widest uppercase"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {editingId ? "Update Store" : "Save Store"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-4 bg-white border border-gray-100 rounded-[1.5rem] outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm font-bold"
          />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm">
           Total: <span className="text-indigo-600">{filteredStores.length}</span>
        </p>
      </div>

      {/* STORES TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Store Entity</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStores.map((s) => (
                <tr key={s._id} className="hover:bg-indigo-50/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                         {s.image ? (
                           <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs">NO IMG</div>
                         )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 leading-none mb-1">{s.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {s._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                      {s.location || "N/A"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">{s.contact_email}</span>
                      <span className="text-[10px] font-bold text-gray-400">{s.contact_phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => startEdit(s)} 
                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(s._id)} 
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
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
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
               <Search size={24}/>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No matching stores found</p>
          </div>
        )}
      </div>
    </div>
  );
}
