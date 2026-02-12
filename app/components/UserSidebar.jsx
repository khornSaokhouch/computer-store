"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User, Package, Heart, ShoppingCart, Settings, LogOut, LayoutDashboard
} from "lucide-react";

export default function UserSidebar({ onLogout }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/profile", icon: LayoutDashboard },
    { name: "My Orders", href: "/orders", icon: Package },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Settings", href: "/account/settings", icon: Settings },
  ];

  return (
    <aside className="w-60 min-h-[calc(100vh-64px)] bg-white border-r border-gray-100 px-3 py-8 flex flex-col">
      <div className="mb-6 px-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Account Menu</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all
                ${active
                    ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`}
            >
              <Icon size={14} strokeWidth={2.5} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 transition-all border border-transparent"
      >
        <LogOut size={14} strokeWidth={2.5} />
        Sign Out
      </button>
    </aside>
  );
}