"use client";

import { useDeleteWorkExperienceMutation } from "@/redux/api/candidateAuth";
import { setModal } from "@/redux/slices/modalSlice";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const getValue = (val) =>
  val !== undefined && val !== null && val !== "" ? val : "Not Available";

const formatDate = (date) => {
  return date ? moment(date).format("DD/MM/YYYY") : "Not Available";
};

const CandidateWorkExperience = ({ initialWorkExperience }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [experienceIdToDelete, setExperienceIdToDelete] = useState(null);

  const dispatch = useDispatch();
  const { userid } = useSelector((state) => state.auth);

  const openWorkExperienceModal = (experience = null) => {
    dispatch(
      setModal({
        modalType: "workExperienceModal",
        modalProps: {
          experience,
        },
      })
    );
  };

  const [deleteWorkExperience, { isLoading: isDeleting }] =
    useDeleteWorkExperienceMutation();

  const handleDelete = async () => {
    if (!experienceIdToDelete) return;

    try {
      await deleteWorkExperience({
        userid,
        experienceId: experienceIdToDelete,
      }).unwrap();

      toast.success("Work experience deleted successfully.");
      closeDeleteModal();
    } catch (error) {
      const errMsg =
        error?.data?.message ||
        error?.message ||
        "Failed to delete experience.";
      toast.error(errMsg);
    }
  };

  const openDeleteModal = (experienceId) => {
    setExperienceIdToDelete(experienceId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setExperienceIdToDelete(null);
  };

  return (
    <div className="space-y-6 w-full bg-white rounded-xl border p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl">Work Experience</h1>
        <PlusCircle
          className="text-gray-500 cursor-pointer"
          onClick={() => openWorkExperienceModal()}
        />
      </div>

      {initialWorkExperience?.workExperience.length === 0 ? (
        <p className="text-gray-500">No work experience added yet.</p>
      ) : (
        initialWorkExperience?.workExperience.map((exp, index) => (
          <div
            key={exp._id || index}
            className="border rounded-lg p-4 space-y-2 relative bg-gray-50"
          >
            <div className="absolute top-4 right-4 flex gap-3">
              <Edit
                className="text-blue-500 cursor-pointer"
                onClick={() => openWorkExperienceModal(exp)}
              />
              <Trash2
                className="text-red-500 cursor-pointer"
                onClick={() => openDeleteModal(exp._id)}
              />
            </div>

            <div>
              <span className="font-semibold text-gray-700">Company:</span>{" "}
              {getValue(exp.companyName)}
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between w-full">
              <div className="w-full">
                <span className="font-semibold text-gray-700">Job Title:</span>{" "}
                {getValue(exp.jobTitle)}
              </div>
              <div className="w-full">
                <span className="font-semibold text-gray-700">Duration:</span>{" "}
                {formatDate(exp.startDate)} -{" "}
                {exp.currentlyEmployed ? "Present" : formatDate(exp.endDate)}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between w-full">
              {/* <div className="w-full">
                <span className="font-semibold text-gray-700">Industry:</span>{" "}
                {getValue(exp.industry)}
              </div> */}
              <div className="w-full">
                <span className="font-semibold text-gray-700">
                  Notice Period:
                </span>{" "}
                {getValue(exp.noticePeriod)}
              </div>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Location:</span>{" "}
              {getValue(exp.location)}
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                Job Description:
              </span>{" "}
              {getValue(exp.jobDescription)}
            </div>
          </div>
        ))
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Delete Experience</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this work experience?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(experienceIdToDelete)}
                disabled={isDeleting}
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

export default CandidateWorkExperience;
