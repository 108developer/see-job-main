"use client";

import React, { useEffect, useState } from "react";
import FilterSidebar from "@/components/ui/filter-sidebar";
import JobCard from "@/components/ui/jobCard";
import { Phone, Upload } from "lucide-react";
import Image from "next/image";
import ResumeUploadModal from "@/components/ui/Resume-modal";
import { useGetAllJobsQuery } from "@/redux/api/jobApi";
import { Button } from "@/components/ui/button";

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center gap-2 mt-6">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? "default" : "outline"}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </Button>
    </div>
  );
};

const page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    salaryMin: null,
    salaryMax: null,
    experienceMin: 0,
    experienceMax: 15,
    country: "",
    state: "",
    city: "",
    role: "",
  });

  // Fetch job data using filters and pagination
  const { data, error, isLoading } = useGetAllJobsQuery({
    page: currentPage,
    filters: filters, // pass filters here
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (updatedFilters) => {
    setFilters((prevFilters) => {
      const newFilters = {
        ...prevFilters,
        ...updatedFilters,
      };

      Object.keys(newFilters).forEach((key) => {
        if (
          newFilters[key] === null ||
          newFilters[key] === "" ||
          newFilters[key] === "null" ||
          newFilters[key] === "NaN"
        ) {
          delete newFilters[key];
        }
      });

      return newFilters;
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading jobs. Please try again later.</div>;
  }

  const jobs = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div>
      <div className="w-full flex items-center py-5 border-b justify-center">
        <div className="max-w-5xl w-full   ">
          <div className="font-semibold">Showing Result For " "</div>
          <div className="flex gap-2 text-sm">
            <div className="border p-2 hover:bg-gray-400">Java</div>
            <div className="border p-2 hover:bg-gray-400">PHP</div>
            <div className="border p-2 hover:bg-gray-400">Bootstrap</div>
            <div className="border p-2 hover:bg-gray-400">HTML</div>
            <div className="border p-2 hover:bg-gray-400">JavaScript</div>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <FilterSidebar onFilterChange={handleFilterChange}>
          <div className="flex flex-col w-full space-y-4">
            {jobs.length === 0 ? (
              <div>No jobs found for the selected filters.</div>
            ) : (
              jobs.map((job) => <JobCard key={job._id} job={job} />)
            )}

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={data?.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </FilterSidebar>

        <div className="w-[500px] flex flex-col gap-5 p-2">
          <div className="rounded-md flex-col gap-4 flex items-center justify-center border-gray-300 border  h-fit py-5 w-full text-center">
            <div className="text-3xl font-bold">Talk To Us</div>
            <div className="text-[#17a2b8] ">Free TollFree no.</div>
            <div className="text-xs text-gray-400">
              Open: Mon - Thur / 10 am - 6 pm
            </div>
            <div className="text-[#17a2b8] text-2xl items-center flex gap-2">
              <Phone fill="#17a2b8" />
              888-888-8888
            </div>
          </div>
          <div className="rounded-md flex items-center justify-center border-gray-300 border  h-fit w-full text-center">
            <div className="p-2 flex flex-col gap-3 text-start">
              <div className=" font-bold">
                Get Personalised Job Recommendations
              </div>
              <div className="text-xs">
                Registering gives you the benefit to browse & apply variety of
                jobs based on your preferences
              </div>
              <button className="rounded-md bg-blue-600 text-white py-2">
                Get Started
              </button>
            </div>
            <div className="items-center justify-center flex gap-2 p-4 bg-gray-300 h-full">
              <Image
                width={100}
                height={100}
                src="https://seejob.netlify.app/images/job-search.png"
                alt="personalized Image"
              />
            </div>
          </div>
          <div className="rounded-md flex flex-col items-center p-2 gap-5 justify-center border-gray-300 border  h-fit w-full text-center">
            <div className=" font-bold flex gap-2">
              {" "}
              <Upload /> Upload Your Resume
            </div>
            <div className="text-xs">
              Registering gives you the benefit to browse & apply variety of
              jobs based on your preferences
            </div>
            <div className="rounded-md bg-yellow-500 w-full text-white py-2">
              <ResumeUploadModal btntext="Upload CV" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
