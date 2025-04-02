"use client";
import { useState } from "react";
import DatabaseService from "./DatabaseService";
import JobPosting from "./JobPosting";
import ComboPackage from "./ComboPackage";

const categories = ["DataBase", "Job Posting", "Combo Package"];

export default function BuyOnline() {
  const [selectedCategory, setSelectedCategory] = useState("DataBase");

  const handleCategory = (value) => {
    setSelectedCategory(value);
  };

  const renderContent = () => {
    return selectedCategory === "DataBase" ? (
      <DatabaseService />
    ) : selectedCategory === "Job Posting" ? (
      <JobPosting />
    ) : (
      <ComboPackage />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-500 text-white text-center p-5">
        <h1 className="text-3xl font-bold">Buy Services</h1>
      </div>
      <div className="lg:px-28 py-4 w-full">
        <div className="relative flex items-center w-full">
          {categories.map((item, key) => (
            <div
              key={key}
              className={`cursor-pointer px-4 py-2 relative z-10 ${
                selectedCategory === item
                  ? "text-red-500 font-semibold bg-white"
                  : "text-blue-400 hover:bg-gray-200"
              }`}
              onClick={() => handleCategory(item)}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-2 relative w-full">
          <div className="absolute bottom-1 left-0 w-full h-1 border-t-[1px] border-gray-400 z-0" />
        </div>

        <div className="mt-5">{renderContent()}</div>
      </div>
    </div>
  );
}
