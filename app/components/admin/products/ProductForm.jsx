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
    <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-10 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Plus size={14} className="text-indigo-600" />
          {editingId ? "Edit Product" : "New Product"}
        </h2>
        {editingId && (
          <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-8">
        {/* Name, Price, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Product Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm font-bold"
              />
            </div>
          </div>

          <Select
            label="Category"
            value={form.category}
            options={categories}
            displayKey="category_name"
            onChange={(v) => setForm({ ...form, category: v, type: "" })}
          />
        </div>

        {/* Type, Brand, Store */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Type"
            value={form.type}
            options={filteredTypeOptions}
            displayKey="type_name"
            disabled={!form.category}
            placeholder={form.category ? "Select Type" : "Select category first"}
            onChange={(v) => setForm({ ...form, type: v })}
          />

          <Select
            label="Brand"
            value={form.brand}
            options={brands}
            displayKey="name"
            onChange={(v) => setForm({ ...form, brand: v })}
          />

          <Select
            label="Store"
            value={form.store_id}
            options={stores}
            displayKey="name"
            onChange={(v) => setForm({ ...form, store_id: v })}
            placeholder="Select Store"
          />

          <Select
            label="Payment Account"
            value={form.paymentAccount}
            options={paymentAccounts}
            displayKey="userName" // or accountId, user usually recognizes name
            onChange={(v) => setForm({ ...form, paymentAccount: v })}
            placeholder="Select Payment Account"
          />
        </div>

        {/* Stock & Warranty + Description + Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />

              <Select
                label="Warranty"
                value={form.warranty}
                options={warranties}
                displayKey="warranty_name"
                onChange={(v) => setForm({ ...form, warranty: v })}
                placeholder="Select Warranty"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl min-h-[120px] resize-none text-sm font-bold"
              />
            </div>
          </div>

          <ImageUpload
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
            setImagesBase64={setImagesBase64}
            existingImages={form.existingImages}
            setExistingImages={(imgs) => setForm({ ...form, existingImages: imgs })}
          />
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-50">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl text-xs tracking-widest uppercase disabled:bg-gray-200 transition-all flex items-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : editingId ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </form>
    </section>
  );
}

// ------------------ Helper Components ------------------
const Input = ({ label, type = "text", value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none"
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
