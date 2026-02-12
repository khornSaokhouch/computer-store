"use client";
import { useState } from "react";
import { Search, Bell, LogOut, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function AdminNavbar() {
  const router = useRouter();
  const { user, logout, rehydrated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "AD";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (!rehydrated || !user) return null;

  // FIX: Change this check. If we are in the Admin Layout, 
  // we want to ensure the user is an ADMIN, not a "user".
  if (user.role !== "admin") return null; 

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="relative w-80 hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search admin panel..."
          className="w-full bg-gray-50 border border-gray-100 rounded-md py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
  <div className="flex flex-col items-end hidden md:block">
    <p className="text-sm font-bold text-gray-800 leading-none">{user.name}</p>
    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">{user.role}</p>
  </div>

  <div className="relative">
    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
      <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-100">
        {getInitials(user.name)}
      </div>
    </button>

    {isOpen && (
      <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
        <div className="px-4 py-2 border-b border-gray-50">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Account</p>
          <p className="text-sm font-medium truncate">{user.email}</p>
        </div>

        {/* LINK TO PROFILE */}
        <Link
          href="/admin/profile"
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <User size={16} /> Profile
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    )}
  </div>
</div>
    </nav>
  );
}