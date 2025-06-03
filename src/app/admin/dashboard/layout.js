"use client";

import AccessDeniedAdmin from "@/components/ui/AccessDeniedAdmin";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const [isClient, setIsClient] = useState(false);

  const { useremail } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  }

  if (useremail !== "admin@example.com") {
    return (
      <div className="flex items-center justify-center w-full p-2">
        <AccessDeniedAdmin title={"Admin"} />{" "}
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/admin/dashboard" },
    { name: "All Jobs", href: "/admin/dashboard/jobs" },
    { name: "Recruiters", href: "/admin/dashboard/recruiters" },
    { name: "Job Seekers", href: "/admin/dashboard/job-seekers" },
    { name: "Bulk Upload", href: "/admin/dashboard/bulk-upload" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-40 border-r bg-white px-6 py-8 shadow-md">
        <Link href={"/admin"}>
          <h2 className="text-xl font-semibold mb-6 text-blue-700">Admin</h2>
        </Link>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ name, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
              >
                {name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-full overflow-auto">
        <div className="bg-white p-6 rounded-lg shadow-md h-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
