"use client";
import { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import ImageUpload from "../products/ImageUpload";

// Reusable Input component
const Input = ({ label, value, onChange, disabled }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none disabled:bg-gray-100"
    />
  </div>
);

export default function StoreForm({ editingId, setEditingId, stores, onSubmit, onSuccess, onError, loading }) {
  const initialState = { name: "", location: "", contact_email: "", contact_phone: "", image: "" };
  const [form, setForm] = useState(initialState);

  // Unified image state: either base64 or existing URL
  const [image, setImage] = useState("");

  useEffect(() => {
    if (editingId) {
      const store = stores.find((s) => s._id === editingId);
      if (store) {
        setForm({
          name: store.name || "",
          location: store.location || "",
          contact_email: store.contact_email || "",
          contact_phone: store.contact_phone || "",
          image: store.image || "",
        });
        setImage(store.image || "");
      }
    } else {
      resetForm();
    }
  }, [editingId, stores]);

  const resetForm = () => {
    setForm(initialState);
    setImage("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return onError("Store name is required");

    const payload = { ...form, image, id: editingId };
    const res = await onSubmit(payload);

    if (res.success) {
      resetForm();
      onSuccess();
    } else onError(res.message);
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-10 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Plus size={14} className="text-indigo-600" />
          {editingId ? "Edit Store" : "New Store"}
        </h2>
        {editingId && (
          <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-10 space-y-6">
        <Input label="Store Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} disabled={loading} />
        <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} disabled={loading} />
        <Input label="Contact Email" value={form.contact_email} onChange={(v) => setForm({ ...form, contact_email: v })} disabled={loading} />
        <Input label="Contact Phone" value={form.contact_phone} onChange={(v) => setForm({ ...form, contact_phone: v })} disabled={loading} />

        <ImageUpload image={image} setImage={setImage} disabled={loading} />

        {/* Submit */}
        <div className="flex justify-end pt-6 border-t border-gray-50">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl text-xs tracking-widest uppercase disabled:bg-gray-200 transition-all flex items-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : editingId ? "Update Store" : "Create Store"}
          </button>
        </div>
      </form>
    </section>
  );
}
