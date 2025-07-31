"use client";

import { useParams } from "next/navigation";
import {
  useDeleteBlogByIdMutation,
  useGetBlogByUrlQuery,
} from "@/redux/api/blogApi";
import moment from "moment";
import { Edit2, Edit3Icon, NotebookPenIcon, Trash2Icon } from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import { useState } from "react";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetBlogByUrlQuery(slug, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteBlogById, { isLoading: isDeleting }] =
    useDeleteBlogByIdMutation();

  const { userid, token, role } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteBlogById(blog._id).unwrap();
      setShowModal(false);
      window.location.href = "/blog";
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog.");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex h-full items-center justify-center w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  if (isError || !data)
    return <div className="p-6 text-red-500">Blog not found.</div>;

  const blog = data?.data;
  const { title, metaDescription, url, content, keywords, createdAt } =
    blog || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm mb-4">
          Posted : {moment(createdAt).format("DD-MM-YYYY")}
        </p>

        {(role === "admin" || role === "uploader") && (
          <div className="flex items-center gap-4 mb-6 justify-center">
            <button>
              <Link href={`/blog/edit/${url}`}>
                <NotebookPenIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />{" "}
              </Link>
            </button>

            <button onClick={() => setShowModal(true)}>
              <Trash2Icon className="w-5 h-5 text-red-600 hover:text-red-800" />
            </button>
          </div>
        )}
      </div>

      <p className="text-sm mb-6 text-gray-700">{metaDescription}</p>

      {keywords?.length > 0 && (
        <div className="my-8 flex flex-wrap gap-2 mt-2">
          {keywords.map((kw, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-200 rounded-md text-xs"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="prose max-w-none">
        {content?.trim() ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p>No content.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow">
            <p>Are you sure you want to delete this blog post?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetailPage;
