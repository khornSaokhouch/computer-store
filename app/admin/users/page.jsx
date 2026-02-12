"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import Link from "next/link";
import { 
  Search, 
  Trash2, 
  UserCog, 
  Mail, 
  Calendar, 
  ArrowLeft,
  Users,
  ShieldCheck,
  Store,
  UserPlus,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  
  // Zustand Stores
  const { user: currentUser, rehydrated } = useAuthStore();
  const { users, loading, fetchUsers, updateUserRole, deleteUser } = useUserStore();

  // Local UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!rehydrated) return;
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login");
      return;
    }
    fetchUsers();
  }, [rehydrated, currentUser, fetchUsers, router]);

  const handleChangeRole = async (userId, newRole) => {
    if (!confirm(`Change user role to ${newRole}?`)) return;
    await updateUserRole(userId, newRole);
    triggerSuccess();
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure? This user will be permanently removed.")) return;
    await deleteUser(userId);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Filter Logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!rehydrated || loading && users.length === 0) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Directory...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* 1. HEADER & BREADCRUMBS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
            <Link href="/admin/dashboard" className="hover:text-indigo-600 transition-colors">Console</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">User Management</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Directory</h1>
        </div>
        
        {showSuccess && (
          <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={16} /> Changes Synchronized
          </div>
        )}
      </div>

      {/* 2. TOP SECTION: STATS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Users size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Users</p>
            <p className="text-2xl font-black text-gray-900">{users.filter(u => u.role === 'user').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Store size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Store Owners</p>
            <p className="text-2xl font-black text-gray-900">{users.filter(u => u.role === 'owner').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl"><ShieldCheck size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrators</p>
            <p className="text-2xl font-black text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter Role</label>
          <select 
            className="bg-white border border-gray-100 rounded-xl py-2 px-4 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition-all"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Access Levels</option>
            <option value="user">Regular Users</option>
            <option value="owner">Store Owners</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: USER LIST (TABLE) */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identiy</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Permission</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-indigo-50/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-100">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 leading-none">{u.name}</p>
                        <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1 font-medium italic">
                          <Mail size={12} className="text-gray-300" /> {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      u.role === "admin" ? "bg-rose-50 text-rose-600 border-rose-100" :
                      u.role === "owner" ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                      "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <Calendar size={14} className="text-gray-300" />
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-3">
                      {/* Only allow changing roles/deleting if NOT self */}
                      {u._id !== currentUser.id ? (
                        <>
                          <div className="relative flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 group-hover:bg-white transition-colors">
                            <UserCog size={14} className="ml-2 text-indigo-400" />
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u._id, e.target.value)}
                              className="bg-transparent text-[11px] font-black uppercase tracking-tighter px-2 py-1.5 outline-none cursor-pointer text-gray-700"
                            >
                              <option value="user">User</option>
                              <option value="owner">Owner</option>
                            </select>
                          </div>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-2.5 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest italic pr-4">Current Session</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                <Search size={32} className="text-gray-200" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No Matches Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}