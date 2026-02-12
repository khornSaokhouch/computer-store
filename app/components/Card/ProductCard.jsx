"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Package, Heart, Loader2, Star } from "lucide-react";
import { useFavoriteStore } from "../../store/favariteStore";
import { useCartStore } from "../../store/cartStore";

export default function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const { addToCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const favorited = isFavorite(product._id);
  const isOutOfStock = product.stock <= 0;
  const brandName = typeof product.brand === "object" ? product.brand?.name : product.brand || "Generic";
  const categoryName = typeof product.category === "object" ? product.category?.category_name : product.category || "";
  
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
    await toggleFavorite(product);
    setIsProcessing(false);
  };

  return (
    <div className="group bg-white rounded-[2rem] border border-gray-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 zoom-in-95">
      {/* Visual Header */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden border-b border-gray-50">
        <Link href={`/products/${product._id}`} className="block w-full h-full">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-200">
               <Package size={40} strokeWidth={1} />
               <span className="text-[8px] font-black uppercase tracking-widest mt-2">No Image</span>
            </div>
          )}
        </Link>
        
        {/* Badges Container */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isNew && (
              <span className="bg-indigo-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-indigo-200 uppercase tracking-widest">
                New
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-rose-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-rose-200 uppercase tracking-widest">
                Sold Out
              </span>
            )}
        </div>

        {/* Small Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={isProcessing}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${favorited ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/80 text-gray-400 border-gray-100 hover:bg-white hover:text-rose-500'}`}
        >
          {isProcessing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Heart size={16} fill={favorited ? "currentColor" : "none"} />
          )}
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">{brandName}</span>
          {!isOutOfStock && (
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">In Stock</span>
            </div>
          )}
        </div>

        <Link href={`/products/${product._id}`} className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-0.5 text-amber-400">
              <Star size={10} fill={product.rating > 0 ? "currentColor" : "none"} strokeWidth={2} />
            </div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
              {product.rating ? product.rating.toFixed(1) : "0.0"} ({product.numReviews || 0})
            </span>
          </div>
          <h3 className="font-black text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-indigo-600 transition-colors tracking-tight">
            {product.name}
          </h3>
          {categoryName && (
             <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
               {categoryName}
             </p>
          )}
        </Link>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 text-center">Price</span>
            <span className="text-sm font-black text-gray-900 tracking-tight">${product.price?.toLocaleString()}</span>
          </div>
          
          <button
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className="w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 disabled:opacity-20 disabled:grayscale"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}