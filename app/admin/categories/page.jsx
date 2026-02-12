"use client";
import { useEffect, useState } from "react";
import {
  FolderPlus,
  Search,
  Pencil,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useCategoryStore } from "../../store/categoryStore";

export default function CategoryPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setError] = useState("");


  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error,
  } = useCategoryStore();

  // ✅ Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);



  // ===== IMAGE HANDLER =====
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ===== CREATE / UPDATE =====
  const saveCategory = async () => {
    if (!name) return;

    const payload = {
      category_name: name,
      description,
      imageBase64,
    };

    let result;
    if (editingId) {
      result = await updateCategory({
        categoryId: editingId,
        ...payload,
      });
    } else {
      result = await createCategory(payload);
    }

    if (result?.success) {
      resetForm();
    }
  };

  // ===== EDIT =====
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setPreview(cat.image || "");
    setImageBase64("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== RESET =====
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPreview("");
    setImageBase64("");
    setError("");
  };
  
  const cancelEdit = () => {
    resetForm();
  };
  

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await deleteCategory(id);
  };

  // ===== SEARCH =====
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  <div className="flex items-center gap-2">
  {(localError || error) && (
    <span className="text-red-500 text-xs font-medium flex items-center gap-1">
      <AlertCircle size={14}/> {localError || error}
    </span>
  )}
</div>


  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-500 mt-1 text-sm">Create and organize your product catalog collections.</p>
        </div>
      </div>

      {/* 1. TOP SECTION: CREATE/EDIT FORM */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
        <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FolderPlus size={18} className="text-indigo-600" />
                {editingId ? "Edit Category Details" : "Create New Category"}
            </h2>
            {editingId && (
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>
            )}
        </div>
        
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Upload Box */}
            <div className="w-full lg:w-48">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center lg:text-left">Category Image</label>
              <div className="relative group aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud size={28} className="text-gray-300 mb-2" />
                    <span className="text-[10px] font-bold text-gray-400">UPLOAD</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            {/* Inputs Box */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-1">Category Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer Collection" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 ml-1">Description (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Short summary of this category" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                />
              </div>
              
              <div className="md:col-span-2 flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    {error && <span className="text-red-500 text-xs font-medium flex items-center gap-1"><AlertCircle size={14}/> {error}</span>}
                </div>
                <div className="flex gap-3">
                    {editingId && (
                        <button onClick={cancelEdit} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                    )}
                    <button 
                        onClick={saveCategory} 
                        disabled={loading || !name} 
                        className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all text-sm"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {editingId ? "Update Category" : "Save Category"}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: SEARCH BAR */}
      <div className="relative w-full md:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Filter categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
        />
      </div>

      {/* 3. BOTTOM SECTION: LIST (TABLE) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preview</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category Info</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-indigo-50/5 transition-colors group">
                <td className="px-8 py-4 w-32">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden shadow-sm">
                    {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20}/></div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">{cat.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-1 italic">{cat.description || "No description provided."}</p>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => startEdit(cat)} 
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => deleteCategory(cat.id)} 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCategories.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm italic">No categories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}