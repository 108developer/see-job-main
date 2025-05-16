"use client";

import { Pagination } from "@/components/Pagination";

import JobCard from "@/components/ui/jobCard";
import { Loader } from "@/components/ui/loader";
import { useGetAllJobsQuery } from "@/redux/api/jobApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdBox from "./AdBox";
import FilterSidebar from "./FilterSidebar";

const page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    salaryMin: 0,
    salaryMax: 250000,
    experienceMin: 0,
    experienceMax: 15,
    jobTypes: [],
  });

  const { userid } = useSelector((state) => state.auth);

  const { data, error, isLoading } = useGetAllJobsQuery({
    page: currentPage,
    filters: filters,
    candidateId: userid,
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
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        Error loading jobs. Please try again later.
      </div>
    );
  }

  const jobs = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div>
      {/* <div className="w-full flex items-center py-5 border-b justify-center">
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
      </div> */}
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
              totalPages={totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        </FilterSidebar>

        <AdBox />
      </div>
    </div>
  );
};

export default page;
