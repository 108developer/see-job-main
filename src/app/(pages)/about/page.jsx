import { getSeoMetadata } from "@/lib/getSeoMetadata";
import ClientWrapper from "./ClientWrapper";

export async function generateMetadata() {
  const seo = await getSeoMetadata("about");

  if (!seo) {
    return {
      title: "See Job - About",
      description: "Your go-to career platform",
    };
  }

  return {
    title: seo.metaTitle || "See Job - About",
    description: seo.metaDescription || "About See Job",
    keywords: seo.metaKeywords || [],
    alternates: {
      canonical: seo.canonicalUrl || undefined,
    },
    openGraph: {
      title: seo.og.title || seo.metaTitle || "See Job - About",
      description: seo.og.description || seo.metaDescription || "",
      url: seo.og.url || undefined,
      type: seo.og.type || "website", // 👈 default fallback
      images: seo.og.image ? [{ url: seo.og.image }] : [],
    },
    twitter: {
      card: seo.twitter.card || "summary_large_image",
      title: seo.twitter.title || seo.metaTitle || "",
      description: seo.twitter.description || seo.metaDescription || "",
      images: seo.twitter.image ? [seo.twitter.image] : [],
      site: seo.twitter.site || undefined,
    },
    ...(seo.structuredData && {
      other: {
        "ld+json": JSON.stringify(JSON.parse(seo.structuredData)),
      },
    }),
  };
}

const Page = () => {
  return <ClientWrapper />;
};

export default Page;
