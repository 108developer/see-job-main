"use client";

import AccessDeniedAdmin from "@/components/ui/AccessDeniedAdmin";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const [useremail, setUseremail] = useState(null);

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("useremail");
    setUseremail(emailFromStorage);
  }, []);

  const navItems = [
    { name: "Overview", href: "/admin/dashboard" },
    { name: "All Jobs", href: "/admin/dashboard/jobs" },
    { name: "Recruiters", href: "/admin/dashboard/recruiters" },
    { name: "Job Seekers", href: "/admin/dashboard/job-seekers" },
    { name: "Bulk Upload", href: "/admin/dashboard/bulk-upload" },
  ];

  return useremail !== "admin@example.com" ? (
    <div className="flex items-center justify-center w-full p-2">
      <AccessDeniedAdmin title={"admin"} />
    </div>
  ) : (
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
