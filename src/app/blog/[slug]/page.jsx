// app/blog/[slug]/page.jsx
import { Loader } from "@/components/ui/loader";
import { Suspense } from "react";
import BlogDetailPage from "./BlogDetailPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/get-blog-by-url/${slug}`
  );
  const json = await res.json();

  if (!json.success) {
    return {
      title: "Blog not found",
      description: "No blog found for this URL",
      openGraph: {
        title: "Blog not found",
        description: "No blog found for this URL",
        siteName: "seejob.in",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Blog not found",
        description: "No blog found for this URL",
      },
      robots: "noindex, nofollow",
      alternates: {
        canonical: "",
      },
    };
  }

  const blog = json.data;

  return {
    title: blog.title,
    description: blog.metaDescription || "",
    keywords: blog.keywords?.join(", ") || "",
    openGraph: {
      title: blog.title,
      description: blog.metaDescription || "",
      url: "canonicalUrl",
      siteName: "seejob.in",
      type: "article",
      images: "imageUrl",
    },
    twitter: {
      card: "imageUrl" ? "summary_large_image" : "summary",
      title: blog.title,
      description: blog.metaDescription || "",
      images: "imageUrl",
    },
    robots: "index, follow",
    alternates: {
      canonical: "canonicalUrl" || "",
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/get-blog-by-url/${slug}`
  );
  const json = await res.json();

  if (!json.success) {
    return <div className="p-6 text-red-500">Blog not found.</div>;
  }

  const blog = json.data;

  // Pass blog as prop to client component for rendering
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center w-full gap-8 p-4">
            <Loader count={5} height={50} className="mb-4" />
          </div>
        }
      >
        <BlogDetailPage blog={blog} />
      </Suspense>
    </div>
  );
}
