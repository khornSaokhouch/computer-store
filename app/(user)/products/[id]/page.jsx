"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProductStore } from "../../../store/productStore";
import { useFavoriteStore } from "../../../store/favariteStore";
import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";
import { ChevronLeft, ShoppingCart, ShieldCheck, Clock, Package, Loader2, Heart, Share2, Plus, Minus, Star } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchProductById, loading } = useProductStore();
  const { toggleFavorite, isFavorite, fetchFavorites } = useFavoriteStore();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchFavorites();
    if (id) fetchProductById(id).then(setProduct).catch(() => {});
  }, [id]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-2">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Syncing Hardware...</p>
    </div>
  );

  if (!product) return <div className="p-20 text-center text-xs font-bold text-gray-400 uppercase">Item not found</div>;

  const favorited = isFavorite(product._id);
  const isOutOfStock = product.stock <= 0;
  const brandName = typeof product.brand === "object" ? product.brand?.name : product.brand || "Generic";

  return (
    <div className="min-h-screen bg-white pb-20 animate-in fade-in duration-500">
      <div className="container mx-auto px-4">
        {/* Compact Breadcrumb */}
        <div className="py-6 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors">
            <ChevronLeft size={14} /> Back to shop
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Share2 size={16} className="text-gray-400" /></button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Visuals */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
              {product.images?.[0] ? (
                <img src={product.images[activeImage]} alt="" className="w-full h-full object-contain p-4" />
              ) : (
                <Package size={60} className="text-gray-200" />
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images?.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`w-16 h-16 rounded-xl border-2 shrink-0 ${activeImage === idx ? 'border-indigo-600' : 'border-transparent opacity-60'}`}>
                  <img src={img} className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-6 max-w-lg">
            <div className="mb-6">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md mb-3 inline-block">
                {brandName}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-3">{product.name}</h1>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">MSRP Price</p>
                  <p className="text-3xl font-black text-indigo-600 tracking-tight">${product.price?.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => toggleFavorite(product)}
                  className={`p-3 rounded-xl border transition-all ${favorited ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-white border-gray-100 text-gray-300"}`}
                >
                  <Heart size={20} fill={favorited ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50"><Minus size={14}/></button>
                    <span className="w-10 text-center text-xs font-black">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50"><Plus size={14}/></button>
                 </div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   Stock: <span className={isOutOfStock ? "text-rose-500" : "text-emerald-500"}>{product.stock} units</span>
                 </p>
              </div>

              <button 
                disabled={isOutOfStock}
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200"
              >
                <ShoppingCart size={16} /> {isOutOfStock ? "Sold Out" : "Deploy to Cart"}
              </button>
            </div>

            {/* Micro Specs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
                <ShieldCheck size={18} className="text-indigo-600" />
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Warranty</p>
                   <p className="text-xs font-bold text-gray-800">{product.warranty?.warranty || "12 Months"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
                <Clock size={18} className="text-indigo-600" />
                <div>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Availability</p>
                   <p className="text-xs font-bold text-gray-800">Ready to Ship</p>
                </div>
              </div>
            </div>

            {/* Premium Reviews Summary */}
            <div className="bg-indigo-50/30 rounded-[2rem] p-6 border border-indigo-50">
               <div className="flex items-center gap-4">
                  <div className="text-3xl font-black text-indigo-600">{(product.rating || 0).toFixed(1)}</div>
                  <div>
                    <div className="flex gap-0.5 text-amber-400 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} strokeWidth={2} />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.numReviews || 0} Verified Reviews</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-20 pt-20 border-t border-gray-50">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">Customer Analysis</h2>
                 <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8">
                   Authentic feedback from our community of digital builders and hardware enthusiasts.
                 </p>
                 
                 <ReviewForm productId={product._id} onReviewAdded={(p) => setProduct(p)} />
              </div>

              <div className="lg:col-span-8">
                 <div className="space-y-10">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, idx) => (
                        <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                           <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-black text-gray-400">
                                   {review.userName?.charAt(0).toUpperCase() || "U"}
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-gray-900">{review.userName || "Confidential Builder"}</p>
                                    <div className="flex gap-0.5 text-amber-400">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={2} />
                                      ))}
                                    </div>
                                 </div>
                              </div>
                              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                           </div>
                           <p className="text-xs text-gray-600 leading-relaxed font-medium pl-11">{review.comment}</p>
                           {review.reply && (
                             <div className="mt-4 ml-11 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Official Response</p>
                                <p className="text-[11px] text-gray-500 font-medium italic">"{review.reply}"</p>
                             </div>
                           )}
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                         <Star size={40} className="text-gray-100 mx-auto mb-4" strokeWidth={1} />
                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Waititng for first review</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

function ReviewForm({ productId, onReviewAdded }) {
  const { user, token } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  if (!user) return (
    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Account required to post</p>
       <button onClick={() => window.location.href='/login'} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Sign in to Review</button>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        onReviewAdded(data.product);
        setComment("");
        setRating(5);
        setMessage({ type: 'success', text: "Analysis submitted successfully!" });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
       console.error(error);
       setMessage({ type: 'error', text: "Internal transmission error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200 animate-in slide-in-from-left-4 duration-700">
       <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6">Submit Feedback</h3>
       
       <div className="mb-6">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Rating Scale</p>
          <div className="flex gap-2">
             {[1, 2, 3, 4, 5].map((star) => (
                <button
                   key={star}
                   type="button"
                   onClick={() => setRating(star)}
                   className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${rating >= star ? 'bg-amber-400 text-white' : 'bg-gray-800 text-gray-600'}`}
                >
                   <Star size={16} fill={rating >= star ? "currentColor" : "none"} strokeWidth={2.5} />
                </button>
             ))}
          </div>
       </div>

       <div className="mb-6">
          <textarea
             placeholder="Your detailed comment..."
             className="w-full h-32 bg-gray-800 border-none rounded-2xl p-4 text-xs text-white font-medium placeholder:text-gray-600 focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
             value={comment}
             onChange={(e) => setComment(e.target.value)}
          />
       </div>

       {message && (
          <p className={`text-[9px] font-black uppercase tracking-widest mb-4 ${message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
             {message.text}
          </p>
       )}

       <button
          disabled={isSubmitting}
          className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-400 hover:text-white transition-all disabled:opacity-50"
       >
          {isSubmitting ? "Transmitting..." : "Post Review"}
       </button>
    </form>
  );
}