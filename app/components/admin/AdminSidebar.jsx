"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore"; // Import this
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ListOrdered, 
  Tag, 
  Layers ,
  LogOut,
  ShoppingBag,
  ShieldCheck 
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: ListOrdered },
  { name: "Brands", href: "/admin/brands", icon: Tag },       // tag icon is okay for brands
  { name: "Types", href: "/admin/types", icon: Layers } ,   
  { name: "Stores", href: "/admin/stores", icon: ShoppingBag} , // layers icon distinguishes types
  { name: "Warranties", href: "/admin/warranties", icon: ShieldCheck  },
  { name: "Payments", href: "/admin/payments", icon: ListOrdered }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore(); // Get logout function

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full hidden md:flex flex-col shrink-0">
      <div className="p-8">
        <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">
          TECH<span className="text-gray-900">.</span>AD
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout} // Connect the function here
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}