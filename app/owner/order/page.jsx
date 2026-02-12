"use client";
import { useEffect, useState } from "react";
import { useOrderStore } from "../../store/orderStore";
import { 
  Package, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  MoreVertical,
  ExternalLink,
  User,
  CreditCard
} from "lucide-react";
import Image from "next/image";

export default function OwnerOrderPage() {
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
      case "paid": return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "shipped": return "bg-blue-50 text-blue-600 border-blue-100";
      case "delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "cancelled": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={12} />;
      case "paid": return <CreditCard size={12} />;
      case "shipped": return <Truck size={12} />;
      case "delivered": return <CheckCircle2 size={12} />;
      case "cancelled": return <AlertCircle size={12} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">ORDER <span className="text-indigo-600">MANAGEMENT</span></h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Review and fulfill your incoming customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-4 shadow-sm">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Orders</p>
              <p className="text-lg font-black text-slate-900">{orders.length}</p>
            </div>
            <div className="w-[1px] h-8 bg-slate-100"></div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
              <p className="text-lg font-black text-indigo-600">${orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-2 md:pb-0">
          {["all", "pending", "paid", "shipped", "delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                statusFilter === status 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-50 animate-pulse rounded-3xl" />)
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
            <Package size={48} className="mx-auto text-slate-100 mb-4" />
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Orders Found</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Try adjusting your filters or search term</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-indigo-100 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-50/50">
              {/* Order Header */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-50/30 border-b border-slate-50 group-hover:bg-white transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all shadow-sm">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Order #{order._id.slice(-8)}</h2>
                      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                       {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
                  <div className="text-left md:text-right shrink-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                    <div className="flex items-center md:justify-end gap-2">
                      <p className="text-xs font-black text-slate-900 truncate max-w-[120px]">{order.user?.name || "Guest Customer"}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Items</p>
                    <p className="text-xs font-black text-slate-900">
                      {order.items.length} Product{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-left md:text-right shrink-0 pr-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-lg font-black text-indigo-600">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Items Summary */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Inventory Breakdown</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-50 group-hover:bg-slate-50 group-hover:border-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm shrink-0">
                            {item.product?.images?.[0] ? (
                              <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300 italic">No Img</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{item.product?.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Qty: {item.quantity} × ${item.price}</p>
                          </div>
                        </div>
                        <p className="text-xs font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery and Status Update */}
                <div className="lg:col-span-5 space-y-6">
                   <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Delivery Logic</h4>
                      <div className="space-y-4">
                         <div className="flex gap-3">
                            <MapPin size={16} className="text-indigo-400 shrink-0" />
                            <div>
                               <p className="text-xs font-black uppercase tracking-tight">{order.shippingAddress?.fullName}</p>
                               <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                                  {order.shippingAddress?.address}, {order.shippingAddress?.city}
                               </p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                               <MapPin size={14} className="text-slate-400" />
                            </div>
                            <p className="text-xs font-bold">{order.shippingAddress?.phone}</p>
                         </div>
                      </div>
                   </div>

                   {/* Status Update Actions */}
                   <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Update Order Status</h4>
                      <div className="relative group/select">
                        <select 
                          className={`w-full appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-widest outline-none transition-all cursor-pointer hover:border-indigo-600 focus:ring-4 focus:ring-indigo-50 ${updatingId === order._id ? 'opacity-50 pointer-events-none' : ''}`}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/select:text-indigo-600 transition-colors">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                      </div>
                      
                      {updatingId === order._id && (
                        <div className="flex items-center justify-center gap-2 py-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest animate-pulse">
                          <Package size={12} className="animate-bounce" /> Updating Record...
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button className="flex items-center justify-center gap-2 py-3 bg-slate-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">
                          <MoreVertical size={14} /> More Options
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                          Details <ExternalLink size={14} />
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}