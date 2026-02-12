"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function Register() {
  const router = useRouter();
  const { register, loading, error, rehydrated } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    if (form.password !== form.confirmPassword) {
      setLocalError("Passwords do not match!");
      return;
    }

    const res = await register(form.name, form.email, form.password, form.confirmPassword);

    if (res.success) {
      setSuccessMessage("Account created! Redirecting to login...");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  if (!rehydrated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="bg-white shadow-2xl shadow-indigo-100 rounded-3xl p-8 w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-300">
        
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            TECH<span className="text-indigo-600">STORE</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">Create your store account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-100 px-10 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full bg-gray-50 border border-gray-100 px-10 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 px-10 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all text-sm"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Status Messages */}
        {(localError || error) && (
          <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
            <AlertCircle size={16} /> {localError || error}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-green-600 text-xs font-bold animate-in slide-in-from-top-2">
            <CheckCircle2 size={16} /> {successMessage}
          </div>
        )}

        <p className="text-center mt-8 text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}