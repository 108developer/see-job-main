import { getSeoMetadata } from "@/lib/getSeoMetadata";
import CandidateLoginPage from "./CandidateLoginPage";

export async function generateMetadata() {
  const seo = await getSeoMetadata("employer_profile");

  if (!seo) {
    return {
      title: "Candidate Login",
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
    <div>
      <CandidateLoginPage />
    </div>
  );
}
