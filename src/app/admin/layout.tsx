import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex">
        {/* Sidebar will be added here */}
        <Sidebar />
        <main className="flex-1 p-6 max-h-[90vh] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 