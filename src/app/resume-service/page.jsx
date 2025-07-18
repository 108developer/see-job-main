// /app/(employer)/job-applications/page.jsx

import { Loader } from "@/components/ui/loader";
import { formatSeoMetadata } from "@/lib/formatSeoMetadata";
import { getSeoMetadata } from "@/lib/getSeoMetadata";
import { Suspense } from "react";
import ResumeService from "./ResumeService";

export async function generateMetadata() {
  const seo = await getSeoMetadata("resume-service");
  return formatSeoMetadata(seo, "Resume Service", "Your go-to career platform");
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
        <ResumeService />
      </Suspense>
    </div>
  );
}
