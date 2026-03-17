"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, ArrowRight, Building2, Globe } from "lucide-react";

export function StoreCard({ store, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link 
        href={`/stores/${store._id}`} 
        className="group relative bg-white rounded-[2rem] border border-slate-100 p-5 hover:border-indigo-600/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 block h-full"
      >
        {/* Merchant Visual Node */}
        <div className="relative h-44 w-full rounded-[1.5rem] overflow-hidden mb-5 bg-slate-50 border border-slate-50">
          {store.image ? (
            <Image 
              src={store.image} 
              alt={store.name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
              <Building2 className="text-slate-200" size={48} strokeWidth={1} />
            </div>
          )}
          
          {/* Status Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md text-white rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest">Active Node</span>
          </div>

          <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Identity Details */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 mb-1">
             <ShieldCheck size={12} className="text-indigo-600" />
             <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Verified Merchant</span>
          </div>
          <h3 className="text-lg font-[1000] text-slate-900 uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
            {store.name}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider truncate">
              {store.location || "Global Distribution Zone"}
            </span>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Globe size={12} className="text-slate-300" />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Hardware Network</span>
           </div>
           <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1">
             Access Stock
           </span>
        </div>
      </Link>
    </motion.div>
  );
}