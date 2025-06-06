import { getSeoMetadata } from "@/lib/getSeoMetadata";
import Contact from "./Contact";
import ContactForm from "./ContactForm";

export async function generateMetadata() {
  const seo = await getSeoMetadata("contact");

  if (!seo) {
    return {
      title: "See Job - Contact",
      description: "Your go-to career platform",
    };
  }

  const validOgTypes = ["website", "article", "profile", "video.other"];
  const ogType = validOgTypes.includes(seo.og?.type) ? seo.og.type : "website";

  return {
    title: seo.metaTitle || "See Job - Contact",
    description: seo.metaDescription || "Contact See Job",
    keywords: seo.metaKeywords || [],
    alternates: {
      canonical: seo.canonicalUrl || undefined,
    },
    openGraph: {
      title: seo.og?.title || seo.metaTitle || "See Job - Contact",
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
  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full h-screen">
      <Contact />
      <ContactForm />
    </div>
  );
};

export default Page;
