"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "../../lib/api";
import { useAuthStore } from "../../store/authStore"; 
import { useUserStore } from "../../store/userStore"; // User Store
import { useProductStore } from "../../store/productStore"; 
import Link from "next/link";
import { 
  Users, UserCheck, Package, ShoppingCart, DollarSign, ArrowUpRight, ExternalLink, MoreVertical, Clock
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  // Zustand Stores
  const { user, rehydrated } = useAuthStore();
  const { totalUsers, totalOwners, fetchUsers } = useUserStore();
  const { totalProducts, fetchProducts } = useProductStore(); // pull from productStore
  
  // Local Stats State (Products, Revenue, Orders)
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rehydrated) return;
  
    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }
  
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Fetch general stats (Revenue, Orders)
        const data = await apiCall("/api/admin/stats");
        if (data.success) setStats(data.stats);
  
        // 2️⃣ Fetch Users to sync counts
        await fetchUsers();
  
        // 3️⃣ Fetch Products to sync count from productStore
        await fetchProducts();
  
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
  
    loadDashboardData();
  }, [user, rehydrated, router, fetchUsers, fetchProducts]);

  
  

  if (!rehydrated || loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4 text-center">
      <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      <p className="text-gray-500 font-black uppercase tracking-widest text-xs animate-pulse">Synchronizing Data...</p>
    </div>
  );

  // Stats Card Configuration
  const statCards = [
    { title: "Total Users", value: totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Owners", value: totalOwners, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { title: "Total Products", value: totalProducts,  icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Total Orders", value: stats?.totalOrders, icon: ShoppingCart, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Console</h1>
          <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">
            Welcome back, <span className="text-indigo-600 font-black">{user?.name}</span>
          </p>
        </div>
        <div className="bg-white border border-gray-100 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm group cursor-default">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Analytics</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, idx) => (
          <div key={idx} className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${item.bg} ${item.color} p-3.5 rounded-2xl group-hover:rotate-6 transition-transform`}>
                <item.icon size={26} />
              </div>
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                +14% <ArrowUpRight size={12} />
              </span>
            </div>
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{item.title}</h3>
            <p className="text-4xl font-black text-gray-900 mt-1 tracking-tighter">{item.value?.toLocaleString() || 0}</p>
          </div>
        ))}
      </div>

      {/* REVENUE & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVENUE CARD */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group border-b-4 border-b-indigo-600">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full -mr-40 -mt-40 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Net Revenue</p>
                <h3 className="text-7xl font-black text-gray-900 tracking-tighter">
                  ${stats?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="bg-indigo-600 text-white p-5 rounded-[2rem] shadow-2xl shadow-indigo-200 group-hover:rotate-12 transition-transform">
                  <DollarSign size={45} />
              </div>
            </div>
            <div className="mt-14 space-y-5">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-gray-400">Monthly Target</span>
                    <span className="text-indigo-600">82% Completed</span>
                </div>
                <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 w-[82%] rounded-full shadow-lg"></div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold italic">
                   <Clock size={12} /> Real-time conversion tracking enabled.
                </div>
            </div>
          </div>
        </div>

        {/* QUICK NAVIGATION */}
        <div className="space-y-4">
            <h3 className="font-black text-[11px] text-gray-400 uppercase tracking-widest ml-3">System Hubs</h3>
            {[{ label: "User Directory", href: "/admin/users", color: "bg-blue-600" },
              { label: "Product Catalog", href: "/admin/products", color: "bg-purple-600" },
              { label: "Order Pipeline", href: "/admin/orders", color: "bg-orange-600" }]
            .map((action) => (
                <Link key={action.label} href={action.href} className="flex items-center justify-between bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:border-indigo-400 hover:shadow-xl hover:translate-x-3 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className={`w-3.5 h-3.5 rounded-full ${action.color} border-4 border-white shadow-sm shadow-black/10`}></div>
                        <span className="font-black text-gray-800 text-sm">{action.label}</span>
                    </div>
                    <ExternalLink size={20} className="text-gray-200 group-hover:text-indigo-600 transition-colors" />
                </Link>
            ))}
        </div>
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Recent Transactions</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Audit Log</p>
          </div>
          <Link href="/admin/orders" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest bg-indigo-50/50 border border-indigo-100 px-6 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
            Full History
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">TXN Hash</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Client Identity</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Amount</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">Lifecycle</th>
                <th className="px-10 py-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-indigo-50/5 transition-all group">
                  <td className="px-10 py-6 font-mono text-xs text-indigo-600 font-black">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-xs font-black text-white shadow-lg">
                            {order.user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 leading-none">{order.user?.name}</p>
                            <p className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-tighter">Verified Buyer</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm font-black text-gray-900">
                    ${order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "Processing"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>{order.orderStatus}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-3 text-gray-300 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all">
                        <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
