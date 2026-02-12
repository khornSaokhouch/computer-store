"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useCategoryStore } from "../store/categoryStore";
import { useCartStore } from "../store/cartStore";
import { Search, ShoppingBag, ChevronDown, User, LogOut, Menu, X, ArrowRight } from "lucide-react";

export default function UserNavbar() {
  const { user, logout, rehydrated } = useAuthStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { cart } = useCartStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  if (!rehydrated) return <div className="h-16 bg-white border-b border-gray-100"></div>;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
        
        {/* Logo - More Compact */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md group-hover:bg-indigo-700 transition-colors">
            <ShoppingBag size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight uppercase hidden sm:block">
            Tech<span className="text-indigo-600">Store</span>
          </span>
        </Link>

        {/* Search - Integrated & Slim */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Search setup..."
            className="w-full pl-10 pr-4 py-1.5 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Links - Small & Subtle */}
        <div className="hidden lg:flex items-center gap-6">
          {["Home", "Products", "About", "Stores"].map((item) => (
            <Link 
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={`text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors ${
                pathname === (item === "Home" ? "/" : `/${item.toLowerCase()}`) ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon - Premium Polish */}
          <Link href="/cart" className="relative p-1.5 hover:bg-gray-50 rounded-full transition-colors group">
            <ShoppingBag size={20} className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
            {rehydrated && cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[8px] font-black flex items-center justify-center rounded-full shadow-lg shadow-indigo-200 border-2 border-white animate-in zoom-in-0 duration-300">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-colors"
              >
                <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50">
                   <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Account</p>
                      <p className="text-xs font-bold truncate">{user.email}</p>
                   </div>
                   <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"><User size={14}/> Profile</Link>
                   {user.role === 'user' && <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 transition-all">Orders</Link>}
                   <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-all border-t border-gray-50 mt-1"><LogOut size={14}/> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link href="/login" className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600">Login</Link>
              <Link href="/register" className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-sm transition-all">Join</Link>
            </div>
          )}

          <button className="lg:hidden p-1.5 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Categories Under-bar (Very slim) */}
      <div className="hidden lg:block border-t border-gray-50 bg-white">
        <div className="container mx-auto px-4 h-9 flex items-center justify-center gap-8">
          {categories?.slice(0, 7).map((cat) => (
            <Link
              key={cat.id}
              href={`/products/category/${encodeURIComponent(cat.name)}`}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/products"
            className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-full transition-all flex items-center gap-1.5 border border-indigo-100/50"
          >
            All Gear <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-[100] p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-200">
           <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search..." className="w-full pl-10 py-2 bg-gray-100 rounded-lg text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
           </form>
           <div className="space-y-4">
              {["Home", "Products", "About", "Stores"].map(item => (
                <Link key={item} href={item === "Home" ? "/" : `/${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="block text-xl font-bold">{item}</Link>
              ))}
           </div>
           <div className="pt-6 border-t border-gray-100 space-y-2">
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-4">Categories</p>
              {categories?.map(cat => (
                <Link key={cat.id} href={`/products/category/${encodeURIComponent(cat.name)}`} onClick={() => setIsMenuOpen(false)} className="block text-sm text-gray-600 py-1">{cat.name}</Link>
              ))}
           </div>
        </div>
      )}
    </nav>
  );
}