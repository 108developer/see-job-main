import { Loader } from "@/components/ui/loader";
import { getSeoMetadata } from "@/lib/getSeoMetadata";
import { Suspense } from "react";
import Wrapper from "./Wrapper";

export async function generateMetadata() {
  const seo = await getSeoMetadata("buy-online");

  if (!seo) {
    return {
      title: "Buy Online",
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
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center w-full gap-8 p-4">
            <Loader count={5} height={50} className="mb-4" />
          </div>
        }
      >
        <Wrapper />
      </Suspense>
    </div>
  );
}
