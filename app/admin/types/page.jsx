"use client";

import { useEffect, useState } from "react";
import {
  FolderPlus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTypeStore } from "../../store/typeStore";
import { useCategoryStore } from "../../store/categoryStore";

export default function TypePage() {
  const [typeName, setTypeName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState("");

  const {
    types,
    fetchTypes,
    createType,
    updateType,
    deleteType,
    loading,
    error,
  } = useTypeStore();

  const { categories, fetchCategories } = useCategoryStore();

  // ✅ Load types and categories on mount
  useEffect(() => {
    fetchTypes();
    fetchCategories();
  }, [fetchTypes, fetchCategories]);

  // ===== CREATE / UPDATE =====
  const saveType = async () => {
    if (!typeName.trim() || !categoryId) {
      return setLocalError("Type name and category are required");
    }

    const payload = {
      type_name: typeName,
      category_id: categoryId,
      description,
    };
    let result;

    if (editingId) {
      result = await updateType({ typeId: editingId, ...payload });
    } else {
      result = await createType(payload);
    }

    if (result?.success) resetForm();
    else setLocalError(result?.message || "Something went wrong");
  };

  // ===== EDIT =====
  const startEdit = (t) => {
    setEditingId(t._id);
    setTypeName(t.type_name);
    setCategoryId(t.category_id);
    setDescription(t.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== RESET FORM =====
  const resetForm = () => {
    setEditingId(null);
    setTypeName("");
    setCategoryId("");
    setDescription("");
    setLocalError("");
  };

  const cancelEdit = () => resetForm();

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this type?")) return;
    await deleteType(id);
  };

  // ===== SEARCH =====
  const filteredTypes = types.filter(
    (t) =>
      t.type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categories.find((c) => c._id === t.category_id)?.category_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Type Management</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create, edit, and organize types under categories.
          </p>
        </div>
      </div>

      {/* 1. CREATE / EDIT FORM */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
        <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <FolderPlus size={18} className="text-indigo-600" />
            {editingId ? "Edit Type" : "Create New Type"}
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
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Type Name */}
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-500 ml-1">
                  Type Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smartphone"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                />
              </div>

              {/* Category Selector */}
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-500 ml-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error + Actions */}
              <div className="md:col-span-3 flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  {(localError || error) && (
                    <span className="text-red-500 text-xs font-medium flex items-center gap-1">
                      <AlertCircle size={14} /> {localError || error}
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
                    onClick={saveType}
                    disabled={loading || !typeName || !categoryId}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all text-sm"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {editingId ? "Update Type" : "Save Type"}
                  </button>
                </div>
              </div>
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
          placeholder="Filter types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
        />
      </div>

      {/* 3. TYPES TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Type Name
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Category
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTypes.map((t) => (
              <tr
                key={t._id}
                className="hover:bg-indigo-50/5 transition-colors group"
              >
                {/* Type Name */}
                <td className="px-8 py-4">{t.type_name}</td>

                {/* Category Name */}
                <td className="px-8 py-4">
                  {t.category_id?.category_name || "Unknown"}
                </td>

                {/* Actions */}
                <td className="px-8 py-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => startEdit(t)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTypes.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm italic">
              No types found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
