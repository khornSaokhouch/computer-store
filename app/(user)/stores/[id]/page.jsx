"use client";

import React, { useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { useStoreStore } from "../../../store/store";
import { useProductStore } from "../../../store/productStore";
import ProductCard from "../../../components/Card/ProductCard";
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Grid2X2, 
  Loader2, 
  PackageX, 
  Building2, 
  ShieldCheck,
  Calendar,
  Layers
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function StoreDetailInner() {
  const { id } = useParams();
  const { store, fetchStoreById, loading: storeLoading } = useStoreStore();
  const { products, fetchProducts, setFilters, loading: productsLoading } = useProductStore();

  useEffect(() => {
    if (id) {
      fetchStoreById(id);
      // Set the store filter and fetch products
      setFilters({ store: id });
    }
  }, [id, fetchStoreById, setFilters]);

  // Special effect to fetch products after filter is set
  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id, fetchProducts]);

  const isLoading = storeLoading || (productsLoading && products.length === 0);

  if (storeLoading && !store) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Store Records...</p>
      </div>
    );
  }

  if (!store && !storeLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <Building2 size={64} className="text-gray-200 mb-6" />
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Store Not Found</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-md">The requested store ID could not be identified in our network.</p>
        <Link href="/stores" className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 🔹 HERO HEADER */}
      <section className="relative h-[40vh] md:h-[50vh] min-h-[400px] overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-40">
          {store?.image ? (
            <Image 
              src={store.image} 
              alt={store.name} 
              fill 
              className="object-cover blur-[2px] scale-105"
            />
          ) : (
             <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-950" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-transparent h-40" />
        
        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-12">
          <Link href="/stores" className="absolute top-32 left-4 text-white/60 hover:text-white flex items-center gap-2 transition-colors">
            <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md">
              <ArrowLeft size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Back to Registry</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end gap-8">
            {/* Store Badge/Logo */}
            <div className="h-32 w-32 md:h-48 md:w-48 rounded-[2.5rem] bg-white p-2 shadow-2xl relative shrink-0">
               <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                  {store?.image ? (
                    <Image src={store.image} alt={store.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                      <Building2 size={64} />
                    </div>
                  )}
               </div>
               <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-white">
                  <ShieldCheck size={18} fill="currentColor" className="text-indigo-200" />
               </div>
            </div>

            {/* Store Information */}
            <div className="flex-1 pb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full mb-4 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">Authorized Hardware Lab</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-950 uppercase tracking-tighter mb-4 leading-none">
                {store?.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-slate-500">
                   <MapPin size={16} className="text-indigo-500" />
                   <span className="text-[12px] font-bold uppercase tracking-widest">{store?.location || "Central HQ"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                   <Calendar size={16} className="text-indigo-500" />
                   <span className="text-[12px] font-bold uppercase tracking-widest">Network Partner since {new Date(store?.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Contact Quick Link */}
            <div className="md:mb-2 flex gap-4">
               <a href={`mailto:${store?.contact_email}`} className="h-14 px-6 bg-slate-100 rounded-2xl flex items-center gap-3 hover:bg-slate-200 transition-all group">
                  <Mail size={18} className="text-slate-400 group-hover:text-indigo-600" />
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Send Signal</p>
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight line-clamp-1">{store?.contact_email || "N/A"}</p>
                  </div>
               </a>
               <div className="h-14 px-6 bg-slate-100 rounded-2xl flex items-center gap-3">
                  <Phone size={18} className="text-slate-400" />
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Direct Comms</p>
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{store?.contact_phone || "N/A"}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 INVENTORY SECTION */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <Layers size={18} className="text-indigo-600" />
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Store Inventory</h2>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Showing all active components in this terminal</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
             <Grid2X2 size={16} className="text-slate-400" />
             <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{products.length} Items Indexed</span>
          </div>
        </div>

        {productsLoading ? (
           <div className="py-24 flex flex-col items-center justify-center gap-4">
             < Loader2 className="animate-spin text-indigo-600" size={40} />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Inventory...</p>
           </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <PackageX className="text-gray-200 mx-auto mb-6" size={64} strokeWidth={1} />
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Inventory Depleted</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No active hardware modules found in this store</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function StoreDetailPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    }>
      <StoreDetailInner />
    </Suspense>
  );
}
