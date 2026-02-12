"use client";
import Link from "next/link";
import { useEffect } from "react";
import Navbar from "./components/UserNavbar";
import Footer from "./components/Footer";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Zap,
  ChevronRight
} from "lucide-react";
import ProductCard from "./components/Card/ProductCard";
import { useProductStore } from "./store/productStore";

export default function HomePage() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (

    <div>
            <Navbar />
    <div className="bg-white px-20 font-sans selection:bg-indigo-100 selection:text-indigo-700">


      <main>
        {/* 1. COMPACT HERO SECTION */}
        <section className="relative pt-10 pb-16 overflow-hidden border-b border-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap size={12} className="text-indigo-600" fill="currentColor" /> 
              Latest Hardware Drops
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">
              Professional Tools for <br className="hidden md:block" />
              <span className="text-indigo-600">Digital Builders.</span>
            </h1>
            
            <p className="max-w-lg mx-auto text-gray-500 text-xs md:text-sm font-medium mb-8 leading-relaxed">
              Premium hardware curated for high-performance setups. 
              Built for speed, designed for absolute precision.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Link
                href="/products"
                className="group bg-gray-900 text-white px-5 py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-md"
              >
                Explore Shop
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* 2. TRENDING PRODUCTS - 5 INLINE ON DESKTOP */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-1">Weekly Picks</p>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                  Featured Setup
                </h2>
              </div>
              <Link href="/products" className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-widest">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {/* Grid Logic: 2 cols (mobile), 3 cols (tablet), 5 cols (desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {products.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. MINI FEATURES - Clean Row */}
        <section className="py-10 bg-gray-50/50 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white border border-gray-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Truck size={16} />
                </div>
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Fast Worldwide Shipping</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white border border-gray-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">24-Month Full Warranty</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white border border-gray-100 text-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <CreditCard size={16} />
                </div>
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Secure Payment Processing</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. NEWSLETTER - Compact Minimalist */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">
                Join the TechStore List.
              </h2>
              <p className="text-gray-500 text-xs font-medium mb-6">
                Get notified about new inventory and setup guides.
              </p>
              <form className="flex gap-2 p-1 bg-gray-100 rounded-xl max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-transparent px-4 py-2 outline-none text-xs font-medium"
                />
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-colors">
                  Join
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>


    </div>
        <Footer />
    </div>
  );
}