import { getSeoMetadata } from "@/lib/getSeoMetadata";
import Privacy from "./Privacy";

export async function generateMetadata() {
  const seo = await getSeoMetadata("privacy");

  if (!seo) {
    return {
      title: "See Job - Privacy",
      description: "Your go-to career platform",
    };
  }

  const validOgTypes = ["website", "article", "profile", "video.other"];
  const ogType = validOgTypes.includes(seo.og?.type) ? seo.og.type : "website";

  return {
    title: seo.metaTitle || "See Job - Privacy",
    description: seo.metaDescription || "Privacy Policy - See Job",
    keywords: seo.metaKeywords || [],
    alternates: {
      canonical: seo.canonicalUrl || undefined,
    },
    openGraph: {
      title: seo.og?.title || seo.metaTitle || "",
      description: seo.og?.description || seo.metaDescription || "",
      url: seo.og?.url || undefined,
      type: ogType,
      images: seo.og?.image ? [{ url: seo.og.image }] : [],
    },
    twitter: {
      card: seo.twitter?.card || "summary_large_image",
      title: seo.twitter?.title || seo.metaTitle || "",
      description: seo.twitter?.description || seo.metaDescription || "",
      images: seo.twitter?.image ? [seo.twitter.image] : [],
      site: seo.twitter?.site || undefined,
    },
    ...(seo.structuredData && {
      other: {
        "ld+json": JSON.stringify(JSON.parse(seo.structuredData)),
      },
    }),
  };
}

const Page = () => {
  return <Privacy />;
};

export default Page;
