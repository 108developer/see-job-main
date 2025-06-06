export function formatSeoMetadata(
  seo,
  fallbackTitle = "See Job",
  fallbackDescription = "Your go-to career platform"
) {
  if (!seo) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }

  const validOgTypes = ["website", "article", "profile", "video.other"];
  const ogType = validOgTypes.includes(seo.og?.type) ? seo.og.type : "website";

  return {
    title: seo.metaTitle || fallbackTitle,
    description: seo.metaDescription || fallbackDescription,
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
