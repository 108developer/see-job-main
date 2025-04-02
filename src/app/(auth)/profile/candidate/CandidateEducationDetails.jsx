"use client";

import { useDispatch } from "react-redux";
import { setModal } from "@/redux/slices/modalSlice";
import { Edit } from "lucide-react";

const CandidateEducationDetails = ({ initialEducationDetails }) => {
  const dispatch = useDispatch();

  const openEducationDetailsModal = () => {
    dispatch(
      setModal({
        modalType: "educationDetailsModal",
        modalProps: { initialEducationDetails },
      })
    );
  };

  return (
    <div className="space-y-6 w-full bg-white rounded-xl border p-8">
      {/* Editable Pencil Icon */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl">Candidate Education Details</h1>
        <div className="flex">
          <Edit
            className="text-gray-500 cursor-pointer"
            onClick={openEducationDetailsModal}
          />
        </div>
      </div>

      {/* Highest Qualification */}
      <div>
        <label htmlFor="highestQualification" className="text-sm font-semibold">
          Highest Qualification
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialEducationDetails.highestQualification}
        </div>
      </div>

      {/* Medium */}
      <div>
        <label htmlFor="medium" className="text-sm font-semibold">
          Medium
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialEducationDetails.medium}
        </div>
      </div>

      {/* Board of Education */}
      <div>
        <label htmlFor="boardOfEducation" className="text-sm font-semibold">
          Board of Education
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialEducationDetails.boardOfEducation}
        </div>
      </div>

      {/* Percentage */}
      <div>
        <label htmlFor="percentage" className="text-sm font-semibold">
          Percentage
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialEducationDetails.percentage}
        </div>
      </div>

      {/* Year of Education */}
      <div>
        <label htmlFor="yearOfEducation" className="text-sm font-semibold">
          Year of Education
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialEducationDetails.yearOfEducation}
        </div>
      </div>

      {/* Education Mode */}
      <div>
        <label className="text-sm font-semibold mb-2">Education Mode</label>
        <div className="space-x-4 flex">
          <div className="flex items-center">
            {initialEducationDetails.educationMode && (
              <div className="mt-1 p-3 w-full border rounded-md">
                {initialEducationDetails.educationMode}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateEducationDetails;
