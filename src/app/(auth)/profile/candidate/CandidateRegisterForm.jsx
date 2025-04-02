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

  return (
    <div className="space-y-6 w-full bg-white rounded-xl border p-8">
      {/* Editable Pencil Icon */}
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
        <label htmlFor="fullName" className="text-sm font-semibold">
          Full Name
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialRegisterForm.fullName}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialRegisterForm.email}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="text-sm font-semibold">
          Phone
        </label>
        <div className="flex items-center">
          <div className="p-3 bg-gray-200 rounded-l-md border-2 border-gray-200">
            +91
          </div>
          <div className="p-3 w-full border rounded-r-md">
            {initialRegisterForm.phone}
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div>
        <label htmlFor="location" className="text-sm font-semibold">
          Current Location
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialRegisterForm.location}
        </div>
      </div>

      {/* Experience */}
      <div className="text-sm font-semibold">
        <h1> Experience (in years)</h1>
        <div className="flex items-center gap-8 justify-between flex-col lg:flex-row font-medium">
          <div className="mt-1 p-3 w-full border rounded-md">
            Min: {initialRegisterForm.minexp}
          </div>
          <div className="mt-1 p-3 w-full border rounded-md">
            Max: {initialRegisterForm.maxexp}
          </div>
        </div>
      </div>

      {/* Key Skills */}
      <div>
        <label htmlFor="skills" className="text-sm font-semibold">
          Key Skills
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialRegisterForm.skills.join(", ")}
        </div>
      </div>

      {/* Preferred Industry */}
      <div>
        <label htmlFor="industry" className="text-sm font-semibold">
          Preferred Industry
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialRegisterForm.industry}
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label htmlFor="jobDescription" className="text-sm font-semibold">
          Job Description
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialRegisterForm.jobDescription}
        </div>
      </div>
    </div>
  );
};

export default CandidateRegister;
