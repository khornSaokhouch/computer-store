"use client";
import { useEffect } from "react";
import { useOrderStore } from "../../store/orderStore";
import Image from "next/image";
import { Package, Clock, MapPin, CreditCard, ChevronRight, Loader2 } from "lucide-react";

export default function OrderPage() {
  const { orders, loading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading History...</span>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-16 text-center">
        <Package size={40} className="mx-auto text-gray-100 mb-4" />
        <p className="text-gray-500 text-sm font-medium mb-2">No orders found</p>
        <p className="text-gray-400 text-xs mb-6">When you buy hardware, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="mb-8">
        <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Purchase History</p>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">MY ORDERS</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-indigo-100 transition-colors shadow-sm"
          >
            {/* Order Top Bar */}
            <div className="p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  <Package size={18} />
                </div>
                <div>
                  <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider">Order #{order._id.slice(-8)}</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-0.5">Total Amount</p>
                  <p className="text-sm font-black text-gray-900">${order.total.toFixed(2)}</p>
                </div>
                <span
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                    order.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" :
                    order.status === "paid" ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                    order.status === "shipped" ? "bg-blue-50 text-blue-600 border-blue-100" :
                    order.status === "delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    order.status === "cancelled" ? "bg-rose-50 text-rose-600 border-rose-100" :
                    "bg-gray-50 text-gray-600 border-gray-100"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items List - Compact */}
            <div className="p-4 md:p-5">
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        {item.product?.images?.[0] ? (
                          <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300">N/A</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-700 truncate max-w-[150px] md:max-w-xs">{item.product?.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-xs font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Order Info Footer - Compact 2-column */}
              <div className="mt-6 pt-5 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <MapPin size={14} className="text-gray-300 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Shipping To</p>
                    <p className="text-xs font-bold text-gray-700">{order.shippingAddress?.fullName}</p>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      {order.shippingAddress?.address}, {order.shippingAddress?.city}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CreditCard size={14} className="text-gray-300 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Payment Details</p>
                    <p className="text-xs font-bold text-gray-700 capitalize">{order.paymentMethod}</p>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter">Transaction Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* View Details Button Overlay */}
            <div className="bg-gray-50/50 py-2 px-5 flex justify-end border-t border-gray-50">
               <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-all">
                  Full Details <ChevronRight size={12} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}