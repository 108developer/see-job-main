import { getSeoMetadata } from "@/lib/getSeoMetadata";
import CandidateProfileWrapper from "./CandidateProfileWrapper";
import { Loader } from "@/components/ui/loader";

export async function generateMetadata() {
  const seo = await getSeoMetadata("candidate_profile");

  if (!seo) {
    return {
      title: "Candidate Profile",
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
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center w-full gap-8 p-4">
          <Loader count={5} height={50} className="mb-4" />
        </div>
      }
    >
      <CandidateProfileWrapper />
    </Suspense>
  );
}
