// /app/(employer)/job-applications/page.jsx

import { Suspense } from "react";
import JobApplications from "./JobApplications";

export const dynamic = "force-dynamic"; // Ensure this page is not statically rendered

export default function Page() {
  return (
    <Suspense fallback={<div>Loading job applications...</div>}>
      <JobApplications />
    </Suspense>
  );
}
