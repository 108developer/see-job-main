// lib/getSeoMetadata.js
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getSeoMetadata = async (slug) => {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/seo/${slug}`, {
      next: { revalidate: 10 },
    });
    const json = await res.json();
    return res.ok && json?.data ? json.data : null;
  } catch (error) {
    console.error("Error fetching SEO metadata:", error);
    return null;
  }
};
