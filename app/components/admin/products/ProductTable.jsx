import { Search, Package, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductTable({
  products,
  brands,
  categories,
  types,
  warranties,
  stores, // <-- added
  searchTerm,
  setSearchTerm,
  onEdit,
  onDelete,
}) {
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brands
        .find((b) => b._id === p.brand?._id || b._id === p.brand)
        ?.name?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      stores
        .find((s) => s._id === p.store_id?._id || s._id === p.store_id)
        ?.name?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ------------------ Search ------------------ */}
      <div className="relative w-full md:w-96 group">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500"
        />
        <input
          type="text"
          placeholder="Filter inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-5 py-4 bg-white border border-gray-100 rounded-10 outline-none shadow-sm text-sm font-bold"
        />
      </div>

      {/* ------------------ Table ------------------ */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Asset
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Store
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Payment Account
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Price
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Stock
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Warranty
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-indigo-50/5 transition-colors group"
                >
                  {/* ASSET */}
                  <td className="px-6 py-5 flex items-center gap-4">
                    {/* ASSET IMAGE */}
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                      {p.images?.length ? (
                        <Link
                          href={`/products/${p._id}`}
                          className="block w-full h-full relative"
                        >
                          <Image
                            src={p.images[0]} // ✅ use the first product image
                            alt={p.name || "Product Image"}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-xl"
                            sizes="(max-width: 768px) 50px, 64px" // ✅ tells Next.js the expected width
                          />
                        </Link>
                      ) : (
                        <Package size={20} className="text-gray-200" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-black text-gray-900 leading-none mb-1">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {brands.find(
                          (b) => b._id === p.brand?._id || b._id === p.brand
                        )?.name || "Unknown Brand"}
                      </p>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase">
                      {categories.find(
                        (c) => c.id === (p.category?._id || p.category)
                      )?.name || "..."}
                    </span>
                  </td>

                  {/* STORE */}
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase">
                      {stores.find(
                        (s) => s._id === p.store_id?._id || s._id === p.store_id
                      )?.name || "..."}
                    </span>
                  </td>

                  {/* PAYMENT ACCOUNT */}
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                      {p.paymentAccount?.userName || "Default"}
                    </span>
                  </td>

                  {/* PRICE */}
                  <td className="px-6 py-5 text-center font-bold text-sm">
                    ${p.price?.toLocaleString()}
                  </td>

                  {/* STOCK */}
                  <td className="px-6 py-5 text-center text-sm">{p.stock}</td>

                  {/* WARRANTY */}
                  <td className="px-6 py-5 text-center text-sm font-bold">
                    {p.warranty?.warranty_name || "None"}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5 text-right flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(p._id)}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
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
