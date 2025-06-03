// lib/getSeoMetadata.js
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Fetch SEO metadata for a given slug
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export const getSeoMetadata = async (slug) => {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/seo/${slug}`, {
      cache: "no-store", // optional: avoids caching if needed
    });
    const json = await res.json();
    return res.ok && json?.data ? json.data : null;
  } catch (error) {
    console.error("Error fetching SEO metadata:", error);
    return null;
  }
};
