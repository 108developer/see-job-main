"use client";

import AccessDeniedAdmin from "@/components/ui/AccessDeniedAdmin";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Boards from "./content/Boards";
import Candidates from "./content/Candidates";
import Degree from "./content/Degree";
import Industry from "./content/Industry";
import JobTitle from "./content/JobTitle";
import Language from "./content/Language";
import Location from "./content/Location";
import Skills from "./content/Skills";

const dashboardItems = [
  "Candidates",
  "Skills",
  "Job Title",
  "Degree",
  "Boards",
  "Industry",
  "Language",
  "Location",
];

const Page = () => {
  const [selectedItem, setSelectedItem] = useState("Skills");
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("useremail");
    const role = localStorage.getItem("role");

    setUserEmail(email);
    setUserRole(role);

    const allowedEmails = ["admin@example.com", "uploader@seejob.in"];
    const allowedRoles = ["admin", "uploader"];

    const authorized =
      (email && allowedEmails.includes(email)) ||
      (role && allowedRoles.includes(role));

    setIsAuthorized(authorized);
  }, []);

  const renderContent = () =>
    selectedItem === "Candidates" ? (
      <Candidates />
    ) : selectedItem === "Skills" ? (
      <Skills />
    ) : selectedItem === "Job Title" ? (
      <JobTitle />
    ) : selectedItem === "Degree" ? (
      <Degree />
    ) : selectedItem === "Boards" ? (
      <Boards />
    ) : // ) : selectedItem === "Industry" ? (
    //   <Industry />
    // selectedItem === "Language" ? (
    //   <Language />
    // ) :
    selectedItem === "Location" ? (
      <Location />
    ) : (
      <div>Select an item</div>
    );

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center w-full p-2">
        <AccessDeniedAdmin title="admin or uploader" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex flex-col bg-gradient-to-b from-gray-500 to-gray-700 text-white w-48 p-6 shadow-lg">
        <Link href={"/admin/dashboard"}>
          <h1 className="flex items-center gap-2 text-xl font-semibold mb-6">
            <LayoutDashboard className="text-red-600 w-8 h-8" /> Dashboard
          </h1>
        </Link>
        {dashboardItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 mt-2 cursor-pointer p-3 space-y-2 rounded-md transition duration-100 ${
              selectedItem === item
                ? "bg-red-600 text-white font-bold"
                : "hover:bg-red-600 text-gray-300"
            }`}
            onClick={() => setSelectedItem(item)}
          >
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 bg-gray-100 overflow-auto min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Page;
