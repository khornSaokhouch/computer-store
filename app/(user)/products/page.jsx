"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProductStore } from "../../store/productStore";
import { useCategoryStore } from "../../store/categoryStore";
import { useBrandStore } from "../../store/brandStore";
import { useTypeStore } from "../../store/typeStore";
import ProductCard from "../../components/Card/ProductCard";
import { Search, Loader2, PackageX, Grid2X2, Sparkles, SlidersHorizontal, ChevronRight, X } from "lucide-react";

// Helper for filter blocks
const FilterBlock = ({ title, items, activeItem, onItemClick, labelKey = "name" }) => (
  <div className="mb-8 last:mb-0">
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
      <span className="w-1 h-1 bg-indigo-500 rounded-full" />
      {title}
    </h3>
    <div className="space-y-1 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
      <button
        onClick={() => onItemClick("")}
        className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all flex items-center justify-between group ${
          !activeItem ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        All Selection
        {!activeItem && <ChevronRight size={12} />}
      </button>
      {items.map((item) => {
        const name = typeof item === "string" ? item : item[labelKey];
        const isActive = activeItem === name;
        return (
          <button
            key={item.id || item._id || name}
            onClick={() => onItemClick(name)}
            className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all flex items-center justify-between group ${
              isActive ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {name}
            {isActive && <ChevronRight size={12} />}
          </button>
        );
      })}
    </div>
  </div>
);

function ProductsInner() {
  const searchParams = useSearchParams();
  const { products, loading, filters, setFilters, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { brands, fetchBrands } = useBrandStore();
  const { types, fetchTypes } = useTypeStore();
  
  const [activeCategory, setActiveCategory] = useState("");
  const [activeBrand, setActiveBrand] = useState("");
  const [activeType, setActiveType] = useState("");

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
    fetchCategories(); fetchBrands(); fetchTypes();
  }, [fetchCategories, fetchBrands, fetchTypes]);

  useEffect(() => {
    fetchProducts();
  }, [filters.search, filters.category, filters.brand, filters.type, fetchProducts]);

  const handleCategoryClick = (val) => {
    setActiveCategory(val);
    setFilters({ ...filters, category: val, type: "" });
    setActiveType("");
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pt-10 pb-20">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* ================= COMPACT HEADER ================= */}
        <div className="bg-white rounded-[24px] p-6 mb-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Global Hardware Index</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-[1000] text-slate-900 tracking-tight leading-none uppercase">
                {activeCategory || "Extreme"} <span className="text-indigo-600">Inventory</span>
              </h1>
            </div>

            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search components or serials..."
                className="w-full h-12 pl-12 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500/30 focus:bg-white transition-all"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              {filters.search && (
                <button onClick={() => setFilters({ ...filters, search: "" })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT SIDEBAR FILTERS ================= */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2 text-slate-900">
                  <SlidersHorizontal size={14} strokeWidth={3} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Filters</span>
                </div>
                {(activeCategory || activeBrand || activeType || filters.search) && (
                   <button 
                     onClick={() => {
                        setActiveCategory(""); setActiveBrand(""); setActiveType("");
                        setFilters({ search: "", category: "", brand: "", type: "" });
                     }}
                     className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                   >
                     Reset
                   </button>
                )}
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm">
                <FilterBlock 
                  title="Category Node" 
                  items={categories} 
                  activeItem={activeCategory} 
                  onItemClick={handleCategoryClick} 
                />

                <div className="h-px bg-slate-100 my-6" />

                <FilterBlock 
                  title="Brand Analysis" 
                  items={brands} 
                  activeItem={activeBrand} 
                  onItemClick={(val) => { setActiveBrand(val); setFilters({...filters, brand: val}) }} 
                />

                <div className="h-px bg-slate-100 my-6" />

                <FilterBlock 
                  title="Hardware Type" 
                  items={types.filter(t => !activeCategory || (t.category_id?.category_name === activeCategory))} 
                  activeItem={activeType} 
                  labelKey="type_name"
                  onItemClick={(val) => { setActiveType(val); setFilters({...filters, type: val}) }} 
                />
              </div>
            </div>
          </aside>

          {/* ================= RIGHT PRODUCT GRID ================= */}
          <main className="lg:col-span-9">
            <div className="mb-6 flex items-center justify-between px-1">
               <div className="flex items-center gap-2">
                  <Grid2X2 size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                    {products.length} Units Found
                  </span>
               </div>
            </div>

            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={40} strokeWidth={1.5} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Lab...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                <PackageX className="text-slate-200 mx-auto mb-6" size={64} strokeWidth={1} />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Registry Empty</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Try adjusting filters or search terms</p>
                <button
                  onClick={() => {
                    setActiveCategory(""); setActiveBrand(""); setActiveType("");
                    setFilters({ search: "", category: "", brand: "", type: "" });
                  }}
                  className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                >
                  Reset Registry
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
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