"use client";

import { setModal } from "@/redux/slices/modalSlice";
import { Edit } from "lucide-react";
import { useDispatch } from "react-redux";

const CandidateRegister = ({ initialRegisterForm }) => {
  const dispatch = useDispatch();

  const openCandidateRegisterModal = () => {
    dispatch(
      setModal({
        modalType: "candidateRegisterModal",
        modalProps: { initialRegisterForm },
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
        <h1 className="text-xl">Candidate Register</h1>
        <div className="flex">
          <Edit
            className="text-gray-500 cursor-pointer"
            onClick={openCandidateRegisterModal}
          />
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
          Full Name
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialRegisterForm?.fullName)}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
          Email
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialRegisterForm?.email)}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
          Phone
        </label>
        <div className="flex items-center text-gray-500">
          <div className="p-3 bg-gray-200 rounded-l-md border-2 border-gray-200">
            +91
          </div>
          <div className="p-3 w-full border rounded-r-md">
            {getValue(initialRegisterForm?.phone)}
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div>
        <label htmlFor="location" className="text-sm font-semibold text-gray-700">
          Current Location
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialRegisterForm?.location)}
        </div>
      </div>

      {/* Experience */}
      <div className="text-sm font-semibold text-gray-700">
        <h1> Experience (in years)</h1>
        <div className="flex items-center gap-8 justify-between flex-col lg:flex-row font-medium text-gray-500">
          <div className="mt-1 p-3 w-full border rounded-md">
            Min: {getValue(initialRegisterForm?.minexp)}
          </div>
          <div className="mt-1 p-3 w-full border rounded-md">
            Max: {getValue(initialRegisterForm?.maxexp)}
          </div>
        </div>
      </div>

      {/* Key Skills */}
      <div>
        <label htmlFor="skills" className="text-sm font-semibold text-gray-700">
          Key Skills
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {initialRegisterForm?.skills?.length > 0
            ? initialRegisterForm.skills.join(", ")
            : "Not Available"}
        </div>
      </div>

      {/* Preferred Industry */}
      <div>
        <label htmlFor="industry" className="text-sm font-semibold text-gray-700">
          Preferred Industry
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialRegisterForm?.industry)}
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label htmlFor="jobDescription" className="text-sm font-semibold text-gray-700">
          Job Description
        </label>
        <div className="mt-1 p-3 w-full border rounded-md text-gray-500">
          {getValue(initialRegisterForm?.jobDescription)}
        </div>
      </div>
    </div>
  );
};

export default CandidateRegister;
