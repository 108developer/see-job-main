"use client";

import Keywords from "@/components/Keywords";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { PenBoxIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const getPageFromSlug = (slug) => {
  if (!slug || slug === "/") return "home";
  return slug.startsWith("/") ? slug.slice(1) : slug;
};

const defaultMetadata = (page) => ({
  page: page || "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
});

const seoValidationSchema = Yup.object().shape({
  metaTitle: Yup.string().required("*Required"),
  metaDescription: Yup.string().required("*Required"),
  metaKeywords: Yup.array()
    .min(1, "*At least one keyword is required")
    .of(Yup.string().required("Keyword cannot be empty")),
});

const SEOModal = ({ slug }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(defaultMetadata(""));
  const [entryExists, setEntryExists] = useState(false);

  const [useremail, setUseremail] = useState(null);

  useEffect(() => {
    const emailFromStorage = localStorage.getItem("useremail");
    setUseremail(emailFromStorage);
  }, []);

  useEffect(() => {
    if (isOpen && slug) fetchMetadata();
  }, [isOpen, slug]);

  const fetchMetadata = async () => {
    const page = getPageFromSlug(slug);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/seo/${page}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setInitialValues(json.data);
        setEntryExists(true);
      } else {
        toast.info(
          json?.message || "No SEO metadata found. You can create one."
        );
        setInitialValues(defaultMetadata(page));
        setEntryExists(false);
      }
    } catch {
      toast.error("Failed to load metadata.");
    }
  };

  const handleSubmit = async (values, method) => {
    try {
      const url =
        method === "POST"
          ? `${BASE_URL}/api/admin/seo`
          : `${BASE_URL}/api/admin/seo/${values.page}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        closeModal();
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to submit");
      }
    } catch {
      toast.error("Submission failed.");
    }
  };

  const handleDelete = async (page) => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/seo/${page}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        closeModal();
        window.location.reload();
      } else {
        toast.error(data.message || "Delete failed.");
      }
    } catch {
      toast.error("Delete failed.");
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    useremail === "admin@example.com" && (
      <>
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50">
          <button
            onClick={openModal}
            className="hover:bg-red-600 text-white px-2 py-1 rounded-md bg-red-500 hover:scale-105 transition duration-300 ease-in-out font-semibold shadow-lg"
          >
            <span className="flex gap-2 items-center justify-between">
              <PenBoxIcon className="h-4 w-4" /> SEO
            </span>
          </button>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex flex-col">
              <h2 className="text-2xl font-bold mb-4">SEO Metadata</h2>

              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={seoValidationSchema}
                onSubmit={(values) =>
                  handleSubmit(values, entryExists ? "PUT" : "POST")
                }
              >
                {({ values, setFieldValue }) => (
                  <Form className="flex flex-col h-full overflow-y-auto">
                    <div className="space-y-2">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">
                          Page
                        </span>
                        <Field
                          name="page"
                          disabled
                          className="w-full border p-2 rounded bg-gray-100"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">
                          Meta Title
                        </span>
                        <Field
                          name="metaTitle"
                          placeholder="Meta Title"
                          className="w-full border p-2 rounded"
                        />
                        <ErrorMessage
                          name="metaTitle"
                          component="div"
                          className="text-red-500 text-xs font-light"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">
                          Meta Description
                        </span>
                        <Field
                          as="textarea"
                          name="metaDescription"
                          placeholder="Meta Description"
                          className="w-full border p-2 rounded"
                        />
                        <ErrorMessage
                          name="metaDescription"
                          component="div"
                          className="text-red-500 text-xs font-light"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-gray-500">
                          Keywords
                        </span>
                        <Keywords
                          value={values.metaKeywords}
                          onChange={(updatedKeywords) =>
                            setFieldValue("metaKeywords", updatedKeywords)
                          }
                        />
                        <ErrorMessage
                          name="metaKeywords"
                          component="div"
                          className="text-red-500 text-xs font-light"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row mt-auto pt-4 space-x-2">
                      {!entryExists && (
                        <div className="flex ml-auto">
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-2 py-1 rounded-md"
                          >
                            Create
                          </button>
                        </div>
                      )}
                      {entryExists && (
                        <div className="flex w-full flex-col md:flex-row items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleDelete(values.page)}
                            className="bg-red-600 text-white px-2 py-1 rounded-md"
                          >
                            Delete
                          </button>
                          <button
                            type="submit"
                            className="bg-green-600 text-white px-2 py-1 rounded-md"
                          >
                            Update
                          </button>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-2 py-1 border border-gray-300 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </>
    )
  );
};

export default SEOModal;
