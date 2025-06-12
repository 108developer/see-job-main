// /app/(employer)/job-applications/page.jsx

import { Loader } from "@/components/ui/loader";
import { formatSeoMetadata } from "@/lib/formatSeoMetadata";
import { getSeoMetadata } from "@/lib/getSeoMetadata";
import { Suspense } from "react";
import JobApplicationsWrapper from "./JobApplicationsWrapper";

export async function generateMetadata() {
  const seo = await getSeoMetadata("job-applications");
  return formatSeoMetadata(
    seo,
    "Job Applications",
    "Your go-to career platform"
  );
}

export default function Page() {
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center w-full gap-8 p-4">
            <Loader count={5} height={50} className="mb-4" />
          </div>
        }
      >
        <JobApplicationsWrapper />
      </Suspense>
    </div>
  );
}
