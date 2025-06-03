// /app/(employer)/job-applications/page.jsx

import { getSeoMetadata } from "@/lib/getSeoMetadata";
import { Suspense } from "react";
import JobApplications from "./JobApplications";

export const dynamic = "force-dynamic"; // Ensure this page is not statically rendered

export async function generateMetadata() {
  const seo = await getSeoMetadata("job-applications");

  if (!seo) {
    return {
      title: "Job Applications",
      description: "Your go-to career platform",
    };
  }

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.metaKeywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.og.title,
      description: seo.og.description,
      url: seo.og.url,
      type: seo.og.type,
      images: [
        {
          url: seo.og.image,
        },
      ],
    },
    twitter: {
      card: seo.twitter.card,
      title: seo.twitter.title,
      description: seo.twitter.description,
      images: [seo.twitter.image],
    },
    ...(seo.structuredData && {
      other: {
        "ld+json": JSON.stringify(JSON.parse(seo.structuredData)),
      },
    }),
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading job applications...</div>}>
      <JobApplications />
    </Suspense>
  );
}
