"use client";
import { useState, useEffect, useMemo } from "react";
import { Plus, X, DollarSign, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function ProductForm({
  editingId,
  setEditingId,
  categories = [],
  brands = [],
  types = [],
  warranties = [],
  stores = [], 
  paymentAccounts = [], // <-- added
  products = [],
  onSubmit,
  onSuccess,
  onError,
  loading,
}) {
  const initialState = {
    name: "",
    price: "",
    category: "",
    type: "",
    brand: "",
    store_id: "", 
    paymentAccount: "", // <-- added
    description: "",
    stock: 0,
    warranty: "",
    existingImages: [],
  };

  const [form, setForm] = useState(initialState);
  const [imagesBase64, setImagesBase64] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

useEffect(() => {
  if (!editingId) return;

  const product = products.find((p) => p._id === editingId || p.id === editingId);
  if (!product) return;

  setForm({
    name: product.name || "",
    price: product.price ?? "",
    category: product.category?._id || product.category?.toString() || "",
    type: product.type?._id || product.type?.toString() || "",
    brand: product.brand?._id || product.brand?.toString() || "",
    store_id: product.store_id?._id || product.store_id?.toString() || "", 
    paymentAccount: product.paymentAccount?._id || product.paymentAccount?.toString() || "", // <-- populate
    warranty: product.warranty?._id || product.warranty?.toString() || "",
    description: product.description || "",
    stock: product.stock ?? 0,
    existingImages: product.images || [],
  });

  setImagePreviews(product.images || []);
  setImagesBase64([]);
}, [editingId, products]);


  const filteredTypeOptions = useMemo(() => {
    if (!form.category) return [];
    return types.filter((t) => {
      const typeCatId = t.category_id?._id || t.category_id || t.category;
      return String(typeCatId) === String(form.category);
    });
  }, [form.category, types]);

  const resetForm = () => {
    setForm(initialState);
    setImagesBase64([]);
    setImagePreviews([]);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category || !form.type || !form.brand || !form.store_id)
      return onError("All required fields must be filled");

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      imagesBase64,
      id: editingId,
    };

    const res = await onSubmit(payload);
    if (res.success) {
      resetForm();
      onSuccess();
    } else {
      onError(res.message);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all">
      <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Plus size={16} className="text-indigo-600" />
          {editingId ? "Edit Product Details" : "Create New Asset"}
        </h2>
        {editingId && (
          <button onClick={resetForm} className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-3 py-1 rounded-lg hover:bg-rose-100">
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-10">
        {/* SECTION 1: BASIC INFO */}
        <div className="space-y-6">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">01. Basic Information</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <Input label="Product Name" placeholder="e.g. MacBook Pro M3" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            </div>
            <div className="relative">
               <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-2 block">Price ($)</label>
               <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
               />
            </div>
            <Input label="Inventory Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
          </div>
        </div>

        {/* SECTION 2: LOGISTICS & CATEGORY */}
        <div className="space-y-6 pt-6 border-t border-slate-50">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">02. Logistics & Classification</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Select label="Category" value={form.category} options={categories} displayKey="category_name" onChange={(v) => setForm({ ...form, category: v, type: "" })} />
            <Select label="Type" value={form.type} options={filteredTypeOptions} displayKey="type_name" disabled={!form.category} onChange={(v) => setForm({ ...form, type: v })} />
            <Select label="Brand" value={form.brand} options={brands} displayKey="name" onChange={(v) => setForm({ ...form, brand: v })} />
            <Select label="Warranty Plan" value={form.warranty} options={warranties} displayKey="warranty_name" onChange={(v) => setForm({ ...form, warranty: v })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Assign to Store" value={form.store_id} options={stores} displayKey="name" onChange={(v) => setForm({ ...form, store_id: v })} />
            <Select label="Settlement Account" value={form.paymentAccount} options={paymentAccounts} displayKey="userName" onChange={(v) => setForm({ ...form, paymentAccount: v })} />
          </div>
        </div>

        {/* SECTION 3: CONTENT & ASSETS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-6 border-t border-slate-50">
          <div className="space-y-4">
             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">03. Product Content</p>
             <textarea
                placeholder="Describe the product features..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl min-h-[180px] resize-none text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
          </div>
          <div className="space-y-4">
             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">04. Visual Assets</p>
             <ImageUpload
                imagePreviews={imagePreviews}
                setImagePreviews={setImagePreviews}
                setImagesBase64={setImagesBase64}
                existingImages={form.existingImages}
                setExistingImages={(imgs) => setForm({ ...form, existingImages: imgs })}
              />
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="group px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-3 disabled:bg-slate-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {editingId ? "Update Product" : "Publish to Catalog"}
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

// Helper: Refined Input
const Input = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
    />
  </div>
);

const Select = ({ label, value, options = [], displayKey, onChange, disabled, placeholder = "Select Option" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <select
      disabled={disabled}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none disabled:opacity-50"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => {
        if (!opt) return null;
        const optId = opt._id || opt.id || "";
        const optLabel = opt[displayKey] || opt.name || "Unknown";
        return (
          <option key={optId} value={optId}>
            {optLabel}
          </option>
        );
      })}
    </select>
  </div>
);
