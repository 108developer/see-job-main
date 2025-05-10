"use client";

import { LayoutDashboard } from "lucide-react";
import { useState } from "react";
import Boards from "./content/Boards";
import Degree from "./content/Degree";
import Industry from "./content/Industry";
import JobTitle from "./content/JobTitle";
import Language from "./content/Language";
import Location from "./content/Location";
import Skills from "./content/Skills";
import Candidates from "./content/Candidates";

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
    ) : selectedItem === "Industry" ? (
      <Industry />
    ) : selectedItem === "Language" ? (
      <Language />
    ) : selectedItem === "Location" ? (
      <Location />
    ) : (
      <div>Select an item</div>
    );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex flex-col bg-gradient-to-b from-gray-500 to-gray-700 text-white w-48 p-6 shadow-lg">
        <h1 className="flex items-center gap-2 text-xl font-semibold mb-6">
          <LayoutDashboard className="text-red-600 w-8 h-8" /> Dashboard
        </h1>
        {/* Sidebar Items */}
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
          {/* Render the selected component */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Page;
