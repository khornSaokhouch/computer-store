"use client";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";
import { Edit3, Calendar, Mail, Shield, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return <div className="p-10 text-center text-gray-500 font-bold uppercase text-xs">Access Denied</div>;
  }

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* Header / Profile Summary */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-gray-200">
            {getInitials(user.name)}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">{user.name}</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-1">
              Verified {user.role}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all">
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-400 mb-3">
            <Mail size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Email Address</span>
          </div>
          <p className="text-sm font-bold text-gray-800">{user.email}</p>
        </div>

        {/* Member Since Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-400 mb-3">
            <Calendar size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Member Since</span>
          </div>
          <p className="text-sm font-bold text-gray-800">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently Joined"}
          </p>
        </div>

        {/* Role/Security Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-400 mb-3">
            <Shield size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Account Status</span>
          </div>
          <p className="text-sm font-bold text-green-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Active / Professional
          </p>
        </div>

        {/* User ID Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-400 mb-3">
            <UserIcon size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Account ID</span>
          </div>
          <p className="text-xs font-mono text-gray-500 truncate"># {user._id || "TECH-4402"}</p>
        </div>
      </div>
    </div>
  );
}