"use client";
import { useEffect } from "react";
import { useFavoriteStore } from "../../store/favariteStore";
import { useAuthStore } from "../../store/authStore";
import ProductCard from "../../components/Card/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { user, rehydrated, token } = useAuthStore();
  const { favorites, loading, fetchFavorites } = useFavoriteStore();

  useEffect(() => {
    if (rehydrated && user && token) fetchFavorites();
  }, [rehydrated, user, token, fetchFavorites]);

  if (!rehydrated || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Heart size={20} />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Authentication Required</p>
        <p className="text-gray-400 text-xs mt-1">Please login to view your saved items.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Your Collection</p>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">MY WISHLIST</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center">
          <p className="text-gray-400 text-sm font-medium mb-4">Your wishlist is currently empty.</p>
          <Link href="/products" className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:gap-3 transition-all">
            Start Shopping <ShoppingBag size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {favorites.map((fav) => {
            const product = fav.product?._id ? fav.product : fav;
            product.brandName = typeof product.brand === "object" ? product.brand?.name : product.brand || "Generic";
            return <ProductCard key={fav._id} product={product} />;
          })}
        </div>
      )}
    </div>
  );
}