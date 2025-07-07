"use client";

import { Pagination } from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useGetAllJobsQuery } from "@/redux/api/admin";
import { useEffect, useState } from "react";
import JobTable from "./JobTable";
import { useSearchParams, useRouter } from "next/navigation";

export default function Jobs() {
  const [limit] = useState(20);
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input
  useEffect(() => {
    if (search === debouncedSearch) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search.trim()) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`/admin/dashboard/jobs?${params.toString()}`);
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, debouncedSearch, searchParams.toString()]);

  const { data, isLoading, isError, error } = useGetAllJobsQuery({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const handleSortChange = (field) => {
    const params = new URLSearchParams(searchParams);

    if (sortBy === field) {
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortOrder", "asc");
    }

    router.push(`/admin/dashboard/jobs?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete("page"); // Clean URL for page 1
    } else {
      params.set("page", newPage.toString());
    }

    router.push(`/admin/dashboard/jobs?${params.toString()}`);
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
      <h2 className="text-lg font-semibold mb-4">All Job</h2>

      <div className="flex gap-4 items-center mb-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {data?.data?.length === 0 ? (
        <p>No result found.</p>
      ) : (
        <JobTable
          data={data?.data || []}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      )}

      <Pagination
        currentPage={page}
        totalPages={data?.pagination?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
