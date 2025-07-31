"use client";

import { useGetAllBlogQuery } from "@/redux/api/blogApi";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import SEOModal from "../modals/SEOModal";

const Blog = () => {
  const { data, isLoading, error } = useGetAllBlogQuery();
  const { userid, token, role } = useSelector((state) => state.auth);

  if (isLoading) return <div className="p-4">Loading blogs...</div>;
  if (error)
    return <div className="p-4 text-red-500">Failed to load blogs.</div>;

  const blogs = data?.data || [];

  return (
    <div className="flex flex-col gap-2 mx-auto items-center p-4">
      <div className="flex items-center justify-between w-full mb-4 lg:px-28">
        <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>

        {(role === "admin" || role === "uploader") && (
          <Link
            href="/blog/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Create Blog
          </Link>
        )}
      </div>

      <div className="grid gap-6 px-4 py-6 md:grid-cols-2 lg:grid-cols-3">
        <SEOModal slug="blog" />
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            href={`/blog/${blog.url}`}
            className="border rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {blog.title}
            </h2>
            <p className="text-gray-600 mt-2">{blog.metaDescription}</p>

            <div className="mt-3 text-sm text-gray-500">
              <strong>Keywords:</strong>{" "}
              {blog.keywords?.length ? blog.keywords.join(", ") : "No keywords"}
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Posted on: {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
