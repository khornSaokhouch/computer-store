"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  LogOut, 
  CreditCard, 
  ShieldCheck, 
  X,
  Monitor,
  ChevronRight,
  User
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { name: "Our Stores", href: "/owner/stores", icon: ShoppingCart },
  { name: "Order Tracking", href: "/owner/order", icon: ShoppingCart },
  { name: "Inventory", href: "/owner/products", icon: Package },
  { name: "Payments", href: "/owner/payments", icon: CreditCard },
  { name: "Warranties", href: "/owner/warranties", icon: ShieldCheck },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden transition-all"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 
        transition-all duration-300 ease-in-out transform lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        flex flex-col font-sans
      `}>
        
        {/* Brand Header */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-xl shadow-lg">
                <Monitor className="text-white" size={18} />
              </div>
              <h1 className="text-sm font-black tracking-tighter text-slate-900 uppercase">
                COMPUTER<span className="text-indigo-600">-</span>STORE
              </h1>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-slate-400 hover:bg-slate-50 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3 pl-1">
            Admin Management
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 mt-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-600 transition-colors"} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-slate-500" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-50 space-y-3">
          {/* Simple Profile Card */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100/50">
            <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600">
               <User size={16} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
               <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tight">
                 {user?.name || "Store Owner"}
               </p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                 Authorized
               </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-xs font-bold text-rose-500 bg-rose-50/30 hover:bg-rose-50 rounded-2xl transition-all uppercase tracking-[0.15em]"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}