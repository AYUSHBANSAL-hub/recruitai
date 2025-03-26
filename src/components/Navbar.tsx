"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, User } from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear the auth token cookie
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/");
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    }
  };

  return (
    <nav className="h-16 border-b bg-white">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Recruit AI</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
        <Button
            onClick={() => router.push("/admin/forms/create")}
            className="bg-gradient-to-b from-indigo-600 to-blue-600 text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Job Form
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
