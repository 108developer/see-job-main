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

  const getValue = (value) =>
    value !== undefined && value !== null && value !== ""
      ? value
      : "Not Available";

  return (
    <div className="space-y-6 w-full bg-white rounded-xl border p-8">
      {/* Header */}
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
        <label
          htmlFor="highestQualification"
          className="text-sm font-semibold text-gray-700"
        >
          Highest Qualification
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialEducationDetails?.highestQualification)}
        </div>
      </div>

      {/* Medium */}
      <div>
        <label htmlFor="medium" className="text-sm font-semibold text-gray-700">
          Medium
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialEducationDetails?.medium)}
        </div>
      </div>

      {/* Board of Education */}
      <div>
        <label
          htmlFor="boardOfEducation"
          className="text-sm font-semibold text-gray-700"
        >
          Board of Education
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialEducationDetails?.boardOfEducation)}
        </div>
      </div>

      {/* Percentage */}
      <div>
        <label
          htmlFor="percentage"
          className="text-sm font-semibold text-gray-700"
        >
          Percentage
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialEducationDetails?.percentage)}
        </div>
      </div>

      {/* Year of Education */}
      <div>
        <label
          htmlFor="yearOfEducation"
          className="text-sm font-semibold text-gray-700"
        >
          Year of Education
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialEducationDetails?.yearOfEducation)}
        </div>
      </div>

      {/* Education Mode */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Education Mode
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialEducationDetails?.educationMode)}
        </div>
      </div>
    </div>
  );
};

export default CandidateEducationDetails;
