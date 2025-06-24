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
        <h1 className="text-xl">Candidate Details</h1>
        <div className="flex">
          <Edit
            className="text-gray-500 cursor-pointer"
            onClick={openCandidateRegisterModal}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between w-full">
        {/* Full Name */}
        <div className="w-full">
          <label
            htmlFor="fullName"
            className="text-sm font-semibold text-gray-700"
          >
            Full Name
          </label>
          <div className=" w-full  text-gray-500">
            {getValue(initialRegisterForm?.fullName)}
          </div>
        </div>

        {/* Email */}
        <div className="w-full">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-700"
          >
            Email
          </label>
          <div className=" w-full  text-gray-500">
            {getValue(initialRegisterForm?.email)}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
        {/* Phone */}
        <div className="w-full">
          <label
            htmlFor="phone"
            className="text-sm font-semibold text-gray-700"
          >
            Phone
          </label>
          <div className="flex items-center text-gray-500">
            +91 {getValue(initialRegisterForm?.phone)}
          </div>
        </div>
        {/* Experience */}
        <div className="text-sm font-semibold text-gray-700 w-full">
          <h1> Experience (in years)</h1>
          <div className="flex items-center gap-8 justify-between flex-col lg:flex-row font-medium text-gray-500">
            <div className=" w-full ">
              Min: {getValue(initialRegisterForm?.minexp)}
            </div>
            <div className=" w-full ">
              Max: {getValue(initialRegisterForm?.maxexp)}
            </div>
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div>
        <label
          htmlFor="location"
          className="text-sm font-semibold text-gray-700"
        >
          Current Location
        </label>
        <div className=" w-full  text-gray-500">
          {getValue(initialRegisterForm?.location)}
        </div>
      </div>

      {/* Preferred Industry */}
      {/* <div>
        <label
          htmlFor="industry"
          className="text-sm font-semibold text-gray-700"
        >
          Preferred Industry
        </label>
        <div className=" w-full  text-gray-500">
          {getValue(initialRegisterForm?.industry)}
        </div>
      </div> */}

      {/* Job Description */}
      <div>
        <label
          htmlFor="jobDescription"
          className="text-sm font-semibold text-gray-700"
        >
          Summary
        </label>
        <div className=" w-full  text-gray-500">
          {getValue(initialRegisterForm?.jobDescription)}
        </div>
      </div>

      {/* Key Skills */}
      <div>
        <label htmlFor="skills" className="text-sm font-semibold text-gray-700">
          Key Skills
        </label>

        <div className="mt-2 flex flex-wrap gap-2">
          {initialRegisterForm?.skills?.length > 0 ? (
            initialRegisterForm.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-300"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-500">Not Available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateRegister;
