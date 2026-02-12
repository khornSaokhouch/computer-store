"use client";
import { X, Edit, Trash2 } from "lucide-react";

export default function StoreTable({ stores = [], onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3">Store Name</th>
            <th className="px-6 py-3">Location</th>
            <th className="px-6 py-3">Contact</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-6 py-4 font-bold">{store.name}</td>
              <td className="px-6 py-4">{store.location}</td>
              <td className="px-6 py-4">{store.contact_email || store.contact_phone}</td>
              <td className="px-6 py-4 flex gap-3">
                <button onClick={() => onEdit(store)} className="text-indigo-600 hover:text-indigo-800">
                  <Edit size={16} />
                </button>
                <button onClick={() => onDelete(store._id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
