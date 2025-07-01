"use client";

import SEOModal from "@/app/modals/SEOModal";
import { Pagination } from "@/components/Pagination";
import AccessDenied from "@/components/ui/AccessDenied ";
import { Loader } from "@/components/ui/loader";

import PostedJobCard from "@/components/ui/postedJobCard";
import { useGetJobsPostedByRecruiterQuery } from "@/redux/api/jobApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PostedJobs = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const { userid, token, role } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (token && role !== "employer" && role !== "recruiter") {
  //     router.push("/");
  //   }
  // }, [token, role, router]);

  const { data, error, isLoading } = useGetJobsPostedByRecruiterQuery({
    page: currentPage,
    userId: userid,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="flex min-h-screen">
      {!(role === "employer" || role === "recruiter") ? (
        <div className="flex items-center justify-center w-full p-2">
          <AccessDenied title1={"employer"} title2={"recruiter"} />
        </div>
      ) : (
        <div className="flex flex-col w-full space-y-4 px-4 md:px-12 lg:px-24 py-8">
          <SEOModal slug="posted-jobs" />
          {jobs.length === 0 ? (
            <div>No jobs found for the selected filters.</div>
          ) : (
            jobs.map((job) => <PostedJobCard key={job._id} job={job} />)
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PostedJobs;
