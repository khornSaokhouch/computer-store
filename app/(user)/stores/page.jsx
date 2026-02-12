"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useStoreStore } from "../../store/store";
import { 
  Store, 
  MapPin, 
  Mail, 
  Phone, 
  Search, 
  ArrowUpRight, 
  Loader2, 
  Building2, 
  Globe, 
  ShieldCheck 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function StoresInner() {
  const { stores, fetchStores, loading } = useStoreStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const filteredStores = stores.filter(store => 
    store.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 🔹 HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-500/10 to-transparent" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Verified Partner Network</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight uppercase">
            Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-indigo-400">Stores</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-sm md:text-base font-medium leading-relaxed mb-10">
            Locate authorized high-performance hardware labs and service centers within our specialized hardware network.
          </p>

          {/* 🔹 SEARCH BAR */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl group-focus-within:border-indigo-500/50 transition-all duration-300">
              <Search className="ml-5 text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder="Find center by name or location..." 
                className="w-full bg-transparent border-none text-white py-4 px-4 text-sm focus:ring-0 placeholder:text-slate-600 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="pr-4 hidden md:block">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">
                  {filteredStores.length} Labs
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 STORES GRID */}
      <section className="container mx-auto px-4 py-20">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
             <div className="relative">
                <Loader2 className="animate-spin text-indigo-600" size={48} strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Scanning Grid...</p>
          </div>
        ) : filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store) => (
              <Link 
                href={`/stores/${store._id}`} 
                key={store._id} 
                className="group relative bg-white rounded-[2.5rem] border border-gray-100/80 p-6 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden block"
              >
                {/* Image Wrap */}
                <div className="relative h-56 w-full rounded-[1.5rem] overflow-hidden mb-6 bg-slate-50 border border-gray-50">
                  {store.image ? (
                    <Image 
                      src={store.image} 
                      alt={store.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="text-gray-200" size={64} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight size={18} />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full shadow-lg">
                    <ShieldCheck size={12} fill="currentColor" className="text-indigo-200" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Active Partner</span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase gap-2 flex items-center tracking-tight">
                      {store.name}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-slate-400 group/item">
                      <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-500 group-hover/item:bg-indigo-50 transition-all">
                        <MapPin size={14} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest flex-1 line-clamp-1">{store.location || "Central Network Zone"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 group/item">
                      <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-emerald-500 group-hover/item:bg-emerald-50 transition-all">
                        <Mail size={14} />
                      </div>
                      <a href={`mailto:${store.contact_email}`} className="text-[11px] font-bold uppercase tracking-widest flex-1 truncate hover:text-emerald-600 transition-colors">
                        {store.contact_email || "network@protocol.net"}
                      </a>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 group/item">
                      <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-blue-500 group-hover/item:bg-blue-50 transition-all">
                        <Phone size={14} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest flex-1">{store.contact_phone || "UPGRADED_VOICE_REQUIRED"}</span>
                    </div>
                  </div>

                  {/* Footer Stats/Action */}
                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                            <Globe size={10} className="text-slate-400" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Global Reach</span>
                    </div>
                    
                    <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 group-hover:translate-x-1 transition-transform">
                      View Stock 
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <Building2 className="text-slate-200 mx-auto mb-6" size={80} strokeWidth={1} />
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-2">No Labs Found</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Adjust your scan area or search protocol</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function StoresPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    }>
      <StoresInner />
    </Suspense>
  );
}