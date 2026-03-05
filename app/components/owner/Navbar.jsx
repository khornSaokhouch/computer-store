"use client";
import { useState } from "react";
import { Search, LogOut, User, Menu, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function AdminNavbar({ onMenuClick }) {
  const router = useRouter();
  const { user, logout, rehydrated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "AD";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (!rehydrated || !user || user.role !== "owner") return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="p-2 lg:hidden text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar - Hidden on small mobile */}
        <div className="relative w-64 md:w-80 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Notifications Icon (Visual Placeholder) */}
        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors hidden xs:block">
          <Bell size={20} />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
            <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-tight mt-1">Administrator</p>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="flex items-center gap-2 p-1 rounded-full hover:ring-4 hover:ring-indigo-50 transition-all"
            >
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {getInitials(user.name)}
              </div>
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Account</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/owner/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <User size={18} /> Profile Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}