"use client";

import {
  usePostPageDataMutation,
  useUpdatePageDataMutation,
} from "@/redux/api/admin";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
];

const ModalForm = ({ data, closeModal, type }) => {
  const [description, setDescription] = useState("");

  const module = { toolbar: toolbarOptions };

  const [postPageData] = usePostPageDataMutation();
  const [updatePageData] = useUpdatePageDataMutation();

  useEffect(() => {
    if (data) {
      setDescription(data.description || "");
    }
  }, [data]);

  const handleSubmit = async () => {
    const payload = { type, description };

    try {
      let response;
      if (data?._id) {
        response = await updatePageData(payload).unwrap();
      } else {
        response = await postPageData(payload).unwrap();
      }

      if (response?.description) {
        toast.success(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } page saved successfully!`
        );
        closeModal();
        window.location.reload();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {data
            ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
            : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </h2>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>

        <ReactQuill
          value={description}
          onChange={setDescription}
          modules={module}
          theme="snow"
          placeholder="Write your about here..."
          className="h-80"
        />
      </div>

      <div className="flex mt-auto justify-end gap-4 pt-2">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {data ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ModalForm;
