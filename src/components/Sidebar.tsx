"use client";



import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  FileText,
  Settings,
  Home,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Forms", href: "/admin/forms", icon: FileText },
    { name: "Applicants", href: "/admin/applicants", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-[90vh] w-16 hover:w-64 flex-col border-r bg-white transition-all duration-300">
      <nav className="flex-1 space-y-2 px-2 py-4 group">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-lg transition-all duration-300",
                isActive
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5 min-w-[20px]" />
              <span className="opacity-0 group-hover:ml-3 group-hover:opacity-100 transition-all duration-300">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;