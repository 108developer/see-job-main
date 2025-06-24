"use client";

import { Pagination } from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useGetAllJobSeekersQuery } from "@/redux/api/admin";
import { useEffect, useState } from "react";
import JobSeekerTable from "../job-seekers/JobSeekerTable";

export default function JobSeekers() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Debounce search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 when searching
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const { data, isLoading, isError, error } = useGetAllJobSeekersQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  if (isError) return <div>Error fetching job seekers: {error.message}</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Job Seekers</h2>

      <div className="flex gap-4 items-center mb-4">
        <Input
          placeholder="Search job seekers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {data?.data?.length === 0 ? (
        <p>No job seekers found.</p>
      ) : (
        <JobSeekerTable data={data?.data || []} />
      )}

      <Pagination
        currentPage={page}
        totalPages={data?.pagination?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
