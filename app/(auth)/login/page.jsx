"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight,AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { login, loading, error, rehydrated } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  if (!rehydrated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const res = await login(form.email, form.password);
  
    if (res.success) {
      switch (res.role) {
        case "user":
          router.push("/"); // normal user
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "owner":
          router.push("/owner/dashboard");
          break;
        default:
          console.error("Unexpected role:", res.role);
          alert("Role not recognized");
      }
    } else {
      alert(res.message);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="bg-white shadow-2xl shadow-indigo-100 rounded-3xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Tech<span className="text-indigo-600">Store</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2">Enter your credentials to continue</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full bg-gray-50 border border-gray-100 px-10 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 px-10 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all text-sm"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-shake">
             <AlertCircle size={16} /> {error}
          </div>
        )}

        <p className="text-center mt-8 text-sm text-gray-500">
          Do not have an account?{" "}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline underline-offset-4">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}