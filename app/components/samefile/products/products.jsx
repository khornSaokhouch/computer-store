"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "../../../store/productStore";
import { useCategoryStore } from "../../../store/categoryStore";
import { useBrandStore } from "../../../store/brandStore";
import { useTypeStore } from "../../../store/typeStore";
import { useWarrantyStore } from "../../../store/warrantyStore";
import { useStoreStore } from "../../../store/store"; // new store for stores
import { usePaymentAccountStore } from "../../../store/paymentAccountStore"; // <-- added
import { useAuthStore } from "../../../store/authStore";
import { AlertCircle } from "lucide-react";

import DashboardHeader from "../../admin/products/DashboardHeader";
import ProductForm from "../../admin/products/ProductForm";
import ProductTable from "../../admin/products/ProductTable";

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, rehydrated } = useAuthStore();

  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();
  const { warranties, fetchWarranties } = useWarrantyStore();
  const { stores, fetchStores } = useStoreStore(); 
  const { accounts, fetchAccounts } = usePaymentAccountStore(); // <-- added
  const { brands, fetchBrands } = useBrandStore();
  const { types, fetchTypes } = useTypeStore();

  const [editingId, setEditingId] = useState(null);
  const [localError, setLocalError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!rehydrated || !user) return;
    
    // Redirect if not authorized
    if (user.role !== "admin" && user.role !== "owner") {
      router.push("/login");
      return;
    }

    // Fetch products based on role
    const uId = user.id || user._id;
    if (user.role === "admin") {
      fetchProducts();
      fetchWarranties();
      fetchStores();
      fetchAccounts(); 
    } else {
      fetchProducts(uId);
      fetchWarranties(uId);
      fetchStores(uId);
      fetchAccounts(uId);
    }

    fetchCategories();
    fetchBrands();
    fetchTypes();
  }, [rehydrated, user, fetchStores, fetchAccounts, fetchProducts, fetchCategories, fetchBrands, fetchTypes, fetchWarranties, router]);

  

  const handleEdit = (product) => {
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    setEditingId(null);
    const uId = user.id || user._id;
    if (user?.role === "admin") {
      fetchProducts();
    } else {
      fetchProducts(uId);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <DashboardHeader title="Inventory" subtitle="Catalog Management" />

      {localError && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold">
          <AlertCircle size={18} /> {localError}
        </div>
      )}

      <ProductForm
        editingId={editingId}
        setEditingId={setEditingId}
        categories={categories}
        brands={brands}
        types={types}
        products={products}
        warranties={warranties}
        stores={stores}
        paymentAccounts={accounts} // <-- pass accounts
        onSubmit={editingId ? updateProduct : createProduct}
        onSuccess={handleSuccess}
        onError={setLocalError}
        loading={loading}
      />

      <ProductTable
        products={products}
        brands={brands}
        categories={categories}
        types={types}
        warranties={warranties}
        stores={stores}
        paymentAccounts={accounts} // <-- pass accounts
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={handleEdit}
        onDelete={deleteProduct}
      />
    </div>
  );
}
