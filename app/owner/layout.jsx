"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/owner/Navbar";
import Sidebar from "../components/owner/Sidebar";

export default function AdminLayout({ children }) {
  const { user, rehydrated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (rehydrated) {
      if (!user || user.role !== "owner") {
        router.push("/login");
      }
    }
  }, [user, rehydrated, router]);

  if (!rehydrated || !user || user.role !== "owner") {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar - Desktop & Mobile Overlay */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Navbar - Passes toggle function */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}