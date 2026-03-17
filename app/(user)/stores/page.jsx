"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useStoreStore } from "../../store/store";
import { Search, Loader2, Building2, Sparkles, X } from "lucide-react";
import { StoreCard } from "../../components/Card/StoreCard"; // Import the card above

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
    <div className="min-h-screen bg-slate-50/30 pt-10 pb-20">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* ================= COMPACT SEARCH CONSOLE ================= */}
        <div className="bg-white rounded-[24px] p-6 mb-10 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Verified Partner Network</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-[1000] text-slate-900 tracking-tight leading-none uppercase">
                Merchant <span className="text-indigo-600">Directory</span>
              </h1>
            </div>

            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Find center by name or location..."
                className="w-full h-12 pl-12 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500/30 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= STORE GRID ================= */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} strokeWidth={1.5} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Grid...</p>
          </div>
        ) : filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map((store, index) => (
              <StoreCard key={store._id} store={store} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
            <Building2 className="text-slate-200 mx-auto mb-6" size={64} strokeWidth={1} />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Registry Offline</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No matching nodes found in this sector</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StoresPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    }>
      <StoresInner />
    </Suspense>
  );
}