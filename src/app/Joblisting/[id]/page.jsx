// Path: src/app/joblisting/[id]/page.jsx

import { getSeoMetadata } from "@/lib/getSeoMetadata";
import JobDetail from "./JobDetail";
import Sidebar from "./Sidebar";

export async function generateMetadata({ params }) {
  const seo = await getSeoMetadata("Joblisting");

  if (!seo) {
    return {
      title: "See Job - Joblisting",
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
