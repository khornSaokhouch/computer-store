import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Github, Mail, ArrowRight, ShieldCheck, Truck, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50/50 border-t border-slate-100/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          
          {/* Brand & Mission */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors shadow-sm">
                <Globe size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight uppercase">
                Tech<span className="text-indigo-600">Registry</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs mb-8">
              Curating the world's most advanced hardware for professionals, enthusiasts, and innovators since 2024.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-sm transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-6">Explore</h4>
            <ul className="space-y-4">
              {["Inventory", "Categories", "Featured", "Deals"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4">
              {["Order Tracking", "Protection", "Help Center", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="md:col-span-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Join our newsletter</h4>
              <p className="text-xs font-medium text-slate-400 mb-6 flex items-center gap-2">
                <Mail size={12} className="text-indigo-500" /> Weekly insights on new hardware.
              </p>
              <form className="relative group">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-12 py-3 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-400"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Feature Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-slate-100/80 mb-8">
          <FeatureItem icon={ShieldCheck} title="Extended Protection" desc="Up to 3 years warranty" />
          <FeatureItem icon={Truck} title="Fast Delivery" desc="Free ship for orders over $500" />
          <FeatureItem icon={Globe} title="Global Registry" desc="Verified hardware providers" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
            <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              © {currentYear} TechRegistry Global
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 tracking-widest uppercase transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 tracking-widest uppercase transition-colors">Cookie Settings</Link>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 rounded-full border border-slate-100">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">System Health: Optimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FeatureItem({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 group-hover:shadow-sm transition-all">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-900 leading-tight">{title}</p>
        <p className="text-[10px] font-medium text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
