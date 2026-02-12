"use client";

import { useEffect, useState } from "react";
import {
  FolderPlus,
  Search,
  Pencil,
  Trash2,
  Plus,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useBrandStore } from "../../store/brandStore";

export default function BrandPage() {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState("");

  const {
    brands,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    loading,
    error,
  } = useBrandStore();

  // ✅ Load brands on mount
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // ===== CREATE / UPDATE =====
  const saveBrand = async () => {
    if (!name.trim()) return setLocalError("Brand name is required");
  
    let result;
    if (editingId) {
      result = await updateBrand({ brandId: editingId, name });
    } else {
      result = await createBrand({ name });
    }
  
    if (result?.success) {
      resetForm();
      fetchBrands(); // REFRESH the list after save
    } else {
      setLocalError(result?.message || "Something went wrong");
    }
  };

  // ===== EDIT =====
  const startEdit = (brand) => {
    setEditingId(brand._id);
    setName(brand.name);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  

  // ===== RESET =====
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setLocalError("");
  };

  const cancelEdit = () => resetForm();

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    const result = await deleteBrand(id);
    if (result?.success) fetchBrands(); // REFRESH the list after delete
  };

  // ===== SEARCH =====
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create, edit, and organize your product brands.
          </p>
        </div>
      </div>

      {/* 1. TOP SECTION: CREATE/EDIT FORM */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
        <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <FolderPlus size={18} className="text-indigo-600" />
            {editingId ? "Edit Brand" : "Create New Brand"}
          </h2>
          {editingId && (
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apple"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  {(localError || error) && (
                    <span className="text-red-500 text-xs font-medium flex items-center gap-1">
                      <AlertCircle size={14}/> {localError || error}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  {editingId && (
                    <button
                      onClick={cancelEdit}
                      className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={saveBrand}
                    disabled={loading || !name}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all text-sm"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {editingId ? "Update Brand" : "Save Brand"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input
          type="text"
          placeholder="Filter brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
        />
      </div>

      {/* 3. BRANDS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand Name</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
  {filteredBrands.map((brand) => (
    <tr key={brand._id} className="hover:bg-indigo-50/5 transition-colors group">
      <td className="px-8 py-4">{brand.name}</td>
      <td className="px-8 py-4 text-right flex justify-end gap-2">
        <button
          onClick={() => startEdit(brand)}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => handleDelete(brand._id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>

        {filteredBrands.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm italic">No brands found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
