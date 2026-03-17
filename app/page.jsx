"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "./components/UserNavbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { Truck, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import ProductCard from "./components/Card/ProductCard";
import { useProductStore } from "./store/productStore";

export default function HomePage() {
  const { products, fetchProducts, resetFilters } = useProductStore();

  useEffect(() => {
    resetFilters();      // clear any leftover filters from the /products page
    fetchProducts();
  }, [fetchProducts, resetFilters]);

  return (
    <div className="bg-white selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar />
      
      <main>
        {/* 1. HERO SECTION */}
        <section className="pt-2">
          <Hero />
        </section>

       

        {/* 3. FEATURED PRODUCTS (6 Inline) */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1400px] mx-auto px-6">
            
            {/* Header */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Weekly Registry</p>
                <h2 className="text-xl lg:text-2xl font-black text-slate-950 tracking-tighter uppercase">
                  Featured Setup
                </h2>
              </div>
              <Link href="/products" className="group text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-widest transition-all">
                Browse All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Grid: 6 Columns on Large Screens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureItem({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-8 h-8 bg-white border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-all rounded-lg flex items-center justify-center shadow-sm">
        <Icon size={14} />
      </div>
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</span>
    </div>
  );
}