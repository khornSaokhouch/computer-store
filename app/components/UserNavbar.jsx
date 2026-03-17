"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { Search, ShoppingBag, ChevronDown, User, LogOut, Menu, X, Settings, Package } from "lucide-react";

export default function UserNavbar() {
  const { user, logout, rehydrated } = useAuthStore();
  const { cart } = useCartStore();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  if (!rehydrated) return <div className="h-16 bg-white border-b border-gray-50"></div>;

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 h-14 lg:h-16 flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 transition-transform active:scale-95 group">
          <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors shadow-sm">
            <ShoppingBag size={18} />
          </div>
          <span className="text-[15px] font-black tracking-tighter uppercase hidden sm:block">
            Tech<span className="text-indigo-600">Registry</span>
          </span>
        </Link>

        {/* Desktop Nav Links & Search */}
        <div className="hidden lg:flex items-center flex-1 gap-8">
          <div className="flex items-center gap-6">
            {["Home", "Products", "Stores"].map((item) => (
              <Link 
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={`text-[11px] font-semibold uppercase tracking-wider hover:text-indigo-600 transition-all ${
                  pathname === (item === "Home" ? "/" : `/${item.toLowerCase()}`) ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input 
              type="text"
              placeholder="Search assets..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 outline-none transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:bg-slate-50 rounded-full transition-colors group">
            <ShoppingBag size={20} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          <div className="h-6 w-[1px] bg-slate-100 mx-1 hidden sm:block" />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-100"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-semibold text-slate-900 leading-none mb-0.5">{user.name.split(' ')[0]}</p>
                  <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-tight leading-none">Member</p>
                </div>
                <div className="w-8 h-8 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold border border-indigo-100">
                  {user.name.charAt(0)}
                </div>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Authenticated As</p>
                      <p className="text-xs font-semibold text-slate-900 truncate">{user.email}</p>
                   </div>
                   
                   <div className="py-1">
                    <DropdownLink href="/profile" icon={User} label="My Profile" />
                    <DropdownLink href="/orders" icon={Package} label="Order History" />
                    <DropdownLink href="/settings" icon={Settings} label="Account Settings" />
                   </div>

                   <div className="mt-1 pt-1 border-t border-slate-50">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all">
                      <LogOut size={14}/> Sign Out
                    </button>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-black transition-colors">Sign In</Link>
              <Link href="/register" className="px-5 py-2 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95">Join</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[56px] bg-white z-[100] px-6 py-8 flex flex-col gap-8 animate-in slide-in-from-right duration-300">
           <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search products..." className="w-full pl-12 py-3 bg-slate-50 border-transparent rounded-2xl text-sm outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
           </form>
           
           <div className="flex flex-col gap-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Navigation</p>
              {["Home", "Products", "Stores", "About"].map(item => (
                <Link key={item} href={item === "Home" ? "/" : `/${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-slate-900 tracking-tighter">{item}</Link>
              ))}
           </div>

           {!user && (
             <div className="mt-auto grid grid-cols-2 gap-4 pb-12">
                <Link href="/login" className="py-4 text-center text-sm font-bold border border-slate-100 rounded-2xl">Login</Link>
                <Link href="/register" className="py-4 text-center text-sm font-bold bg-indigo-600 text-white rounded-2xl">Join Now</Link>
             </div>
           )}
        </div>
      )}
    </nav>
  );
}

function DropdownLink({ href, icon: Icon, label }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-2 text-[12px] font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
      <Icon size={14} className="opacity-70" /> {label}
    </Link>
  );
}