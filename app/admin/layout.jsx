"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/admin/AdminNavbar";
import Sidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const { user, rehydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (rehydrated) {
      if (!user || user.role !== "admin") {
        router.push("/login");
      }
    }
  }, [user, rehydrated, router]);

  if (!rehydrated || !user || user.role !== "admin") {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}