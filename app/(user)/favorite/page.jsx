// "use client";
// import { useEffect, useState } from "react";
// import { useFavoriteStore } from "../../store/favariteStore";
// import { useAuthStore } from "../../store/authStore";
// import ProductCard from "../../components/Card/ProductCard";

// export default function ProductsPage({ products = [] }) {
//   const { fetchFavorites, favorites } = useFavoriteStore();
//   const { user } = useAuthStore();
//   const [userFavoriteProducts, setUserFavoriteProducts] = useState([]);

//   useEffect(() => {
//     if (user) fetchFavorites();
//   }, [user]);

//   useEffect(() => {
//     if (favorites.length > 0) {
//       // Here we assume fav.product is populated
//       const favIds = favorites.map(fav => fav.product._id);
//       const filtered = products.filter(p => favIds.includes(p._id));
//       setUserFavoriteProducts(filtered);
//     } else {
//       setUserFavoriteProducts([]);
//     }
//   }, [favorites, products]);

//   if (!user) {
//     return <p className="text-center mt-10">Please login to see your favorite products.</p>;
//   }

//   return (
//     <div className="grid grid-cols-4 gap-6">
//       {userFavoriteProducts.length > 0 ? (
//         userFavoriteProducts.map(product => (
//           <ProductCard key={product._id} product={product} />
//         ))
//       ) : (
//         <p className="text-center col-span-4">You have no favorite products.</p>
//       )}
//     </div>
//   );
// }
