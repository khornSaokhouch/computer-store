"use client";
import Navbar from "../components/UserNavbar";
import Footer from "../components/Footer";
import UserSidebar from "../components/UserSidebar";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";

const ProfileLayout = ({ children }) => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="bg-white min-h-screen px-20">
      <Navbar />

      <div className="flex bg-gray-50/50">
        {/* Sidebar - Fixed width on desktop */}
        <div className="hidden lg:block shrink-0">
          <UserSidebar onLogout={handleLogout} />
        </div>

        {/* Main content - Slimmer padding */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileLayout;