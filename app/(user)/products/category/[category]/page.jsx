"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProductStore } from "../../../../store/productStore";
import { useCategoryStore } from "../../../../store/categoryStore";
import ProductCard from "../../../../components/Card/ProductCard";
import { ChevronLeft, Loader2, PackageX, Sparkles, SlidersHorizontal, Grid2X2 } from "lucide-react";

export default function CategoryPage() {
  const { category: categoryName } = useParams();
  const router = useRouter();
  const decodedCategory = decodeURIComponent(categoryName);
  
  const { products, loading, setFilters, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
    // Set filter and fetch
    setFilters({ category: decodedCategory, search: "" });
    fetchProducts();
  }, [decodedCategory, fetchCategories, fetchProducts, setFilters]);

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-700">
      {/* Premium Category Header */}
      <section className="bg-gray-50 border-b border-gray-100 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl -ml-24 -mb-24" />
        
        <div className="container mx-auto px-4 relative z-10">
          <button 
            onClick={() => router.push("/products")}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors mb-8"
          >
            <ChevronLeft size={14} /> Back to Catalog
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                 <Sparkles size={14} className="text-indigo-600" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Category Collection</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                {decodedCategory}
              </h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Available Items</p>
                  <p className="text-xl font-black text-gray-900">{products.length} Products</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-50">
           <div className="flex items-center gap-6">
              {categories?.slice(0, 5).map(cat => (
                 <button 
                   key={cat.id}
                   onClick={() => router.push(`/products/category/${encodeURIComponent(cat.name)}`)}
                   className={`text-[10px] font-black uppercase tracking-widest transition-colors hidden md:block ${cat.name === decodedCategory ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   {cat.name}
                 </button>
              ))}
           </div>
           
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all">
                 <SlidersHorizontal size={14} /> Filter
              </button>
              <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400">
                 <Grid2X2 size={16} />
              </button>
           </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-indigo-600" size={40} strokeWidth={1.5} />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Filtering Inventory...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
             {products.map((product) => (
               <ProductCard key={product._id} product={product} />
             ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-100">
             <PackageX className="text-gray-200 mx-auto mb-6" size={64} strokeWidth={1} />
             <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Inventory Empty</h3>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Check back later for new arrivals in {decodedCategory}</p>
          </div>
        ) }
      </div>
    </div>
  );
}
