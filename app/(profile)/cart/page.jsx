"use client";
import { useEffect } from "react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
  const router = useRouter();
  const { user, token, rehydrated } = useAuthStore();
  const { cart, loading, fetchCart, updateQuantity, removeFromCart, totalPrice } = useCartStore();

  useEffect(() => {
    if (rehydrated && token) fetchCart();
  }, [rehydrated, token, fetchCart]);

  if (!rehydrated || !user) return <div className="p-20 text-center text-xs font-bold text-gray-400">PLEASE LOGIN TO VIEW CART</div>;

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing Cart...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Secure Checkout</p>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">SHOPPING BAG</h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center">
          <ShoppingCart size={40} className="mx-auto text-gray-100 mb-4" />
          <p className="text-gray-500 text-sm font-medium mb-6">Your bag is empty</p>
          <Link href="/products" className="bg-gray-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-3">
            {cart.map((item) => (
              <div key={item._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-50">
                  {item.product.images?.[0] ? (
                    <Image src={item.product.images[0]} alt={item.product.name} width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">NO IMG</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{item.product.name}</h3>
                  <p className="text-indigo-600 font-black text-xs mt-1">${item.product.price}</p>
                </div>

                {/* Compact Quantity Control */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button 
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="text-right px-4 hidden sm:block">
                  <p className="text-xs font-black text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>

                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        
          {/* Compact Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 uppercase text-[10px] font-black">Free</span>
                </div>
                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-sm font-black text-gray-900 tracking-tight">Total</span>
                  <span className="text-lg font-black text-indigo-600">${totalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-lg shadow-gray-100"
              >
                Checkout Now
              </button>
              
              <p className="text-[9px] text-gray-400 text-center mt-4 uppercase font-bold">
                Tax calculated at checkout
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}