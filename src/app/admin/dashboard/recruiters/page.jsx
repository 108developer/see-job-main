"use client";

import { Pagination } from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useGetAllRecruitersQuery } from "@/redux/api/admin";
import { useEffect, useState } from "react";
import RecruiterTable from "./RecruiterTable";

export default function Recruiters() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError, error, refetch } = useGetAllRecruitersQuery(
    {
      page,
      limit,
      search: debouncedSearch,
      sortBy,
      sortOrder,
    }
  );

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage) => setPage(newPage);
  const totalPages = data?.pagination?.totalPages || 1;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  if (isError)
    return <div>Error occurred while fetching recruiters: {error.message}</div>;

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Recruiters</h2>

      <div className="mb-4">
        <Input
          placeholder="Search recruiters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {data?.data?.length === 0 ? (
        <p>No recruiters found.</p>
      ) : (
        <RecruiterTable data={data?.data || []} refetch={refetch} />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
