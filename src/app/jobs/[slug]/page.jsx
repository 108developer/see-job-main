// Path: src/app/jobs/[slug]/page.jsx

import JobDetail from "./JobDetail";
import Sidebar from "./Sidebar";

// Fetch job data by ID
async function getJobBySlug(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/jobs/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.job;
}

// SEO Metadata Generator
export async function generateMetadata(context) {
  const params = await context.params;
  const job = await getJobBySlug(params.slug);

  if (!job) {
    return {
      title: "Job not found - Joblisting",
      description: "This job listing could not be found.",
    };
  }

  const {
    jobTitle,
    city,
    state,
    country,
    hiringForCompanies,
    jobDescription,
    url,
    createdAt,
    jobType,
  } = job;

  const title = `${jobTitle} at ${hiringForCompanies} in ${city}, ${state} | Joblisting`;
  const description = `Apply for the role of ${jobTitle} at ${hiringForCompanies}, located in ${city}, ${state}, ${country}. ${jobDescription}`;
  const keywords = [
    jobTitle,
    hiringForCompanies,
    city,
    "Remote Jobs",
    "Software Engineer Jobs",
  ].join(", ");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://yourdomain.com/joblisting/${url}`,
    },
    openGraph: {
      title,
      description,
      url: `https://yourdomain.com/joblisting/${url}`,
      type: "website",
      images: [
        {
          url: "https://yourdomain.com/default-job-image.jpg", // Replace with dynamic if available
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://yourdomain.com/default-job-image.jpg"],
    },
    other: {
      "ld+json": JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        title: jobTitle,
        description: jobDescription,
        datePosted: createdAt,
        employmentType: jobType.join(", "),
        hiringOrganization: {
          "@type": "Organization",
          name: hiringForCompanies,
          sameAs: "https://yourdomain.com",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressRegion: state,
            addressCountry: country,
          },
        },
      }),
    },
  };
}

// Page Component
export default function Page({ params }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 px-8 py-6">
      {/* Main Content */}
      <div className="w-full lg:w-3/4">
        <JobDetail />
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-1/4">
        <Sidebar />
      </aside>
    </div>
  );
}
