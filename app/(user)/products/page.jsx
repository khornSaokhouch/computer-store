"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProductStore } from "../../store/productStore";
import { useCategoryStore } from "../../store/categoryStore";
import { useBrandStore } from "../../store/brandStore";
import { useTypeStore } from "../../store/typeStore";
import ProductCard from "../../components/Card/ProductCard";
import { Search, Layers, ChevronDown, Loader2, PackageX, Filter, Grid2X2, Sparkles } from "lucide-react";

function ProductsInner() {
  const searchParams = useSearchParams();
  const { products, loading, filters, setFilters, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { brands, fetchBrands } = useBrandStore();
  const { types, fetchTypes } = useTypeStore();
  const [activeCategory, setActiveCategory] = useState("");
  const [activeBrand, setActiveBrand] = useState("");
  const [activeType, setActiveType] = useState("");

  // Sync with URL params
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const type = searchParams.get("type") || "";
    setFilters({ search, category, brand, type });
    setActiveCategory(category);
    setActiveBrand(brand);
    setActiveType(type);
  }, [searchParams, setFilters]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchTypes();
  }, [fetchCategories, fetchBrands, fetchTypes]);

  useEffect(() => {
    fetchProducts();
  }, [filters.search, filters.category, filters.brand, filters.type, fetchProducts]);

  const handleCategoryClick = (catName) => {
    const newVal = activeCategory === catName ? "" : catName;
    setActiveCategory(newVal);
    setFilters({ ...filters, category: newVal, type: "" }); // Reset type when category changes
    setActiveType("");
  };

  const handleBrandClick = (brandName) => {
    const newVal = activeBrand === brandName ? "" : brandName;
    setActiveBrand(newVal);
    setFilters({ ...filters, brand: newVal });
  };

  const handleTypeClick = (typeName) => {
    const newVal = activeType === typeName ? "" : typeName;
    setActiveType(newVal);
    setFilters({ ...filters, type: newVal });
  };

  const handleResetFilters = () => {
    setActiveCategory("");
    setActiveBrand("");
    setActiveType("");
    setFilters({ search: "", category: "", brand: "", type: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <section className="bg-gray-50 border-b border-gray-100 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <Sparkles size={16} className="text-indigo-600" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Premium Inventory</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6 animate-in fade-in slide-in-from-top-8 duration-700 uppercase">
             {filters.category ? filters.category : "EXTREME STORE"}
          </h1>
          
          {/* Enhanced Search */}
          <div className="max-w-xl mx-auto relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search components, setups, peripherals..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-gray-300"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Inline Category Pills */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-gray-50 overflow-x-auto no-scrollbar">
         <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0">Categories:</span>
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button 
                    onClick={() => handleCategoryClick("")}
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!activeCategory ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button 
                      key={c.id}
                      onClick={() => handleCategoryClick(c.name)}
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === c.name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {c.name}
                    </button>
                  ))}
               </div>
            </div>

            {/* Brand Filter */}
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0">Analysis:</span>
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button 
                    onClick={() => handleBrandClick("")}
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!activeBrand ? 'bg-slate-900 text-white shadow-lg shadow-slate-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                    Every Brand
                  </button>
                  {brands.map((b) => (
                    <button 
                      key={b.id}
                      onClick={() => handleBrandClick(b.name)}
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeBrand === b.name ? 'bg-slate-900 text-white shadow-lg shadow-slate-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {b.name}
                    </button>
                  ))}
               </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 shrink-0">Hardware:</span>
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button 
                    onClick={() => handleTypeClick("")}
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${!activeType ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >
                    All Types
                  </button>
                  {types
                    .filter(t => !activeCategory || (t.category_id?.category_name === activeCategory))
                    .map((t) => (
                    <button 
                      key={t._id}
                      onClick={() => handleTypeClick(t.type_name)}
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeType === t.type_name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {t.type_name}
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Results Info */}
        {!loading && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <Grid2X2 size={16} className="text-gray-300" />
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                 Showing {products.length} {products.length === 1 ? 'Hardware' : 'Components'}
               </p>
            </div>
            {filters.category || filters.search || filters.brand || filters.type ? (
              <button 
                onClick={handleResetFilters}
                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-rose-100"
              >
                Reset All
              </button>
            ) : null}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="relative">
               <Loader2 className="animate-spin text-indigo-600" size={48} strokeWidth={1.5} />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
               </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Syncing Lab...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 animate-in zoom-in-95 duration-500">
            <PackageX className="text-gray-200 mx-auto mb-6" size={64} strokeWidth={1} />
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">No Hardware in stock</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Try adjusting your search or category filters</p>
            <button
              onClick={handleResetFilters}
              className="px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    }>
      <ProductsInner />
    </Suspense>
  );
}

