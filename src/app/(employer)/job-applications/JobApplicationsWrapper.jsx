"use client";
import { useEffect, useState } from "react";
import JobApplications from "./JobApplications";
import { Loader } from "@/components/ui/loader";

export default function JobApplicationsWrapper() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  }

  return <JobApplications />;
}
