"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";
import { 
  Package, ShoppingCart, TrendingUp, Layers, 
  Plus, Eye, Edit, AlertCircle, Loader2, 
  ChevronRight, ArrowUpRight, Search, Filter
} from "lucide-react";

export default function OwnerDashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalSales: 0,
    totalOrders: 0,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "owner") {
      router.push("/login");
      return;
    }
    if (token) fetchDashboardData();
  }, [user, token, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/owner/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white font-sans">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="font-sans ">
      {/* Top Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Welcome back, <span className="text-indigo-600">{user?.name}</span>. Here is what's happening today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filter
          </button>
          <Link
            href="/owner/products/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} /> New Product
          </Link>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Revenue", value: `$${stats.totalSales.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Products", value: stats.totalProducts, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Inventory", value: stats.totalStock, icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                <item.icon size={22} />
              </div>
              <span className="text-xs font-bold text-emerald-500 flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} className="mr-1" /> 12%
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Table Container */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Recent Inventory</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-slate-50 border-none rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-40 md:w-60"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 text-[11px] font-bold uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.slice(0, 6).map((product) => (
                  <tr key={product._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                          IMG
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{product.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{product.category?.name || "General"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">${product.price.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {product.stock} Units
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/owner/products/${product._id}/edit`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Edit size={16} />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-50 text-center">
             <Link href="/owner/products" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
               View Full Inventory
             </Link>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Stock Alert Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" /> Critical Stock
            </h3>
            <div className="space-y-3">
              {products.filter(p => p.stock < 10).slice(0, 4).map(p => (
                <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{p.name}</p>
                    <p className="text-[10px] font-medium text-orange-600">Restock needed</p>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{p.stock}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support / Tip Card */}
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-lg font-bold mb-2 relative z-10">Sales Tip</h3>
            <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-4 relative z-10">
              Products with clear white backgrounds sell 40% faster. Update your listings today!
            </p>
            <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors relative z-10">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}