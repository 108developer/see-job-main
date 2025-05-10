"use client";

import { useDispatch } from "react-redux";
import { setModal } from "@/redux/slices/modalSlice";
import { useState } from "react";

const DeleteConfirmModal = ({ handleDelete }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const closeModal = () => {
    dispatch(setModal(null));
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await handleDelete();
      closeModal();
    } catch (error) {
      console.error("Delete failed:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this work experience? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={closeModal}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
