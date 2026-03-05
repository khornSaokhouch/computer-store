"use client";

import { useEffect, useState, useMemo } from "react";
import { useOrderStore } from "../../store/orderStore";
import { useAuthStore } from "../../store/authStore";
import { 
  Package, Search, CheckCircle2, Truck, AlertCircle,
  Clock, CreditCard, Loader2, Calendar, ChevronRight,
  Filter, Store as StoreIcon, MoreHorizontal, ArrowUpDown,
  Download, Eye
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OwnerOrderPage() {
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrderStore();
  const { token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderId = order._id.toLowerCase();
      const customerName = (order.user?.name || "Guest").toLowerCase();
      const matchesSearch = orderId.includes(searchTerm.toLowerCase()) || customerName.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
      case "paid": return "bg-blue-50 text-blue-600 border-blue-100";
      case "shipped": return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "cancelled": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="font-sans pb-20">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 font-medium mt-1">Manage fulfillment and customer history.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `$${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, color: "text-indigo-600" },
          { label: "Active Orders", value: orders.filter(o => o.status !== 'delivered').length, color: "text-amber-600" },
          { label: "Completed", value: orders.filter(o => o.status === 'delivered').length, color: "text-emerald-600" },
          { label: "Total Orders", value: orders.length, color: "text-slate-900" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID or customer..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
          {["all", "pending", "paid", "shipped", "delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                statusFilter === status 
                ? "bg-slate-900 text-white shadow-md" 
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List (Table Style) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-400 font-medium">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="group hover:bg-slate-50/30 transition-colors">
                    {/* ID & Date */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-[11px] text-slate-400 font-bold mt-1.5 uppercase">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-700">{order.shippingAddress?.fullName || "Guest"}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{order.shippingAddress?.city}</p>
                    </td>

                    {/* Items Preview */}
                    <td className="px-6 py-5">
                      <div className="flex -space-x-2 overflow-hidden">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 overflow-hidden relative border border-slate-100">
                             {item.product?.images?.[0] ? (
                               <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                             ) : (
                               <div className="flex items-center justify-center h-full text-[8px] text-slate-300 uppercase font-black">?</div>
                             )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 text-[10px] font-bold text-slate-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900">${order.total.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Paid via Card</p>
                    </td>

                    {/* Status Pill */}
                    <td className="px-6 py-5">
                      <select 
                        disabled={updatingId === order._id}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-all ${getStatusStyle(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/owner/order/${order._id}`} 
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}