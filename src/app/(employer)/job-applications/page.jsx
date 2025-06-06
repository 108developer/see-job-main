// /app/(employer)/job-applications/page.jsx

import { formatSeoMetadata } from "@/lib/formatSeoMetadata";
import { getSeoMetadata } from "@/lib/getSeoMetadata";
import { Suspense } from "react";
import JobApplications from "./JobApplications";

export const dynamic = "force-dynamic";

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
    <Suspense fallback={<div>Loading job applications...</div>}>
      <JobApplications />
    </Suspense>
  );
}
