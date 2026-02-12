"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore"; // your Zustand store

export default function OwnerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore(); // get user from Zustand
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

    // Simulate fetching stats and products
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Replace with real API calls if needed
      // For now, simulate owner-specific stats/products
      const simulatedStats = {
        totalProducts: 12,
        totalStock: 240,
        totalSales: 1234.56,
        totalOrders: 18,
      };

      const simulatedProducts = [
        {
          _id: "1",
          name: "Product A",
          category: "Category 1",
          price: 50,
          stock: 10,
          rating: 4.5,
          owner: { _id: user._id },
        },
        {
          _id: "2",
          name: "Product B",
          category: "Category 2",
          price: 80,
          stock: 20,
          rating: 4.0,
          owner: { _id: user._id },
        },
      ];

      setStats(simulatedStats);
      setProducts(simulatedProducts);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm mb-2">My Products</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalProducts}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm mb-2">Total Stock</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalStock}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-green-600">
            ${stats.totalSales.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm mb-2">Orders</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalOrders}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/owner/products/new"
          className="bg-blue-600 text-white rounded-lg shadow p-6 hover:bg-blue-700 text-center"
        >
          <h3 className="text-xl font-bold">Add New Product</h3>
          <p className="text-sm mt-2">Create a new product listing</p>
        </Link>
        <Link
          href="/owner/orders"
          className="bg-orange-600 text-white rounded-lg shadow p-6 hover:bg-orange-700 text-center"
        >
          <h3 className="text-xl font-bold">View Orders</h3>
          <p className="text-sm mt-2">Manage customer orders</p>
        </Link>
      </div>

      {/* My Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">My Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Product</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Price</th>
                <th className="text-left py-2">Stock</th>
                <th className="text-left py-2">Rating</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="py-2">{product.name}</td>
                  <td className="py-2">{product.category}</td>
                  <td className="py-2">${product.price}</td>
                  <td className="py-2">{product.stock}</td>
                  <td className="py-2">⭐ {product.rating.toFixed(1)}</td>
                  <td className="py-2">
                    <Link
                      href={`/owner/products/${product._id}/edit`}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/products/${product._id}`}
                      className="text-green-600 hover:underline"
                    >
                      View
                    </Link>
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
