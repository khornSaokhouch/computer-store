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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-100">
                      {p.images?.length ? (
                        <Image src={p.images[0]} alt="" fill className="object-cover" />
                      ) : (
                        <Package size={20} className="m-auto text-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-tight">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase">{p.brand?.name || "Brand"}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{p.category?.category_name}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5 text-center">
                    <p className="text-sm font-black text-slate-900">${p.price?.toLocaleString()}</p>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      p.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {p.stock} Units left
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                       <p className="text-[11px] font-bold text-slate-600 uppercase">{p.store_id?.name || 'Main Warehouse'}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 pl-3">ACC: {p.paymentAccount?.userName || 'Default'}</p>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => onDelete(p._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
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
