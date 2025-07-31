// PATH : see-job-main\src\app\blog\edit\[slug]\page.jsx

"use client";

import AccessDeniedAdmin from "@/components/ui/AccessDeniedAdmin";
import {
  useGetBlogByUrlQuery,
  useUpdateBlogByIdMutation,
} from "@/redux/api/blogApi";
import { ErrorMessage, Field, Form, Formik } from "formik";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
];

const inputClass =
  "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  metaDescription: Yup.string().required("Meta description is required"),
  url: Yup.string()
    .matches(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens allowed"
    )
    .required("URL is required"),
  content: Yup.string().test(
    "content-check",
    "Content is required",
    (value) => {
      const stripped = value?.replace(/<[^>]*>/g, "").trim();
      return !!stripped;
    }
  ),
  keywords: Yup.array()
    .of(Yup.string())
    .min(1, "At least one keyword is required"),
});

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const { userid, role } = useSelector((state) => state.auth);

  const { data, isLoading: loadingBlog } = useGetBlogByUrlQuery(slug);
  const [updateBlogById, { isLoading: saving }] = useUpdateBlogByIdMutation();

  const blog = data?.data;

  const [isClient, setIsClient] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || loadingBlog) return null;

  if (!(role === "admin" || role === "uploader")) {
    return (
      <div className="flex items-center justify-center w-full p-2">
        <AccessDeniedAdmin title="admin" />
      </div>
    );
  }

  const initialValues = {
    title: blog?.title || "",
    metaDescription: blog?.metaDescription || "",
    url: blog?.url || "",
    content: blog?.content || "",
    keywords: blog?.keywords || [],
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = { userid, ...values };
      const response = await updateBlogById({
        id: blog._id,
        updatedData: payload,
      }).unwrap();
      if (response?.success) {
        toast.success(response.message || "Blog updated!");
        router.push(`/blog/${values.url}`);
        resetForm();
      } else {
        toast.error(response.message || "Update failed.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update blog.");
    }
  };

  if (!loadingBlog && !blog) {
    return (
      <div className="text-center py-10 text-gray-500">Blog not found.</div>
    );
  }

  return (
    <div className="w-full py-6 px-4 md:px-16 lg:px-28">
      <h1 className="text-2xl font-semibold mb-6">Edit Blog</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6 w-full">
            {/* Title */}
            <div>
              <label htmlFor="title" className="text-sm font-semibold">
                Title
              </label>
              <Field
                name="title"
                id="title"
                placeholder="Title"
                className={inputClass}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label
                htmlFor="metaDescription"
                className="text-sm font-semibold"
              >
                Meta Description
              </label>
              <Field
                name="metaDescription"
                id="metaDescription"
                placeholder="Short description"
                className={inputClass}
              />
              <ErrorMessage
                name="metaDescription"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* URL Slug */}
            <div>
              <label htmlFor="url" className="text-sm font-semibold">
                URL
              </label>
              <Field
                name="url"
                id="url"
                placeholder="example-blog-post"
                className={inputClass}
              />
              <ErrorMessage
                name="url"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="text-sm font-semibold">Keywords</label>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (
                        keywordInput.trim() &&
                        !values.keywords.includes(keywordInput.trim())
                      ) {
                        const newKw = [...values.keywords, keywordInput.trim()];
                        setFieldValue("keywords", newKw);
                        setKeywordInput("");
                      }
                    }
                  }}
                  className={inputClass}
                  placeholder="Press Enter to add keyword"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (
                      keywordInput.trim() &&
                      !values.keywords.includes(keywordInput.trim())
                    ) {
                      const newKw = [...values.keywords, keywordInput.trim()];
                      setFieldValue("keywords", newKw);
                      setKeywordInput("");
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap mt-2 gap-2">
                {values.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {kw}
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => {
                        const upd = [...values.keywords];
                        upd.splice(i, 1);
                        setFieldValue("keywords", upd);
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <ErrorMessage
                name="keywords"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="text-sm font-semibold">
                Content
              </label>
              <div className="flex flex-col h-80 w-full overflow-auto">
                <ReactQuill
                  className="w-full min-h-64"
                  value={values.content}
                  onChange={(content) => setFieldValue("content", content)}
                  modules={{ toolbar: toolbarOptions }}
                  theme="snow"
                  placeholder="Write blog content..."
                />
              </div>
              <ErrorMessage
                name="content"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 mt-4 bg-red-600 text-white rounded-md"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Blog"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
