"use client";

import { Edit } from "lucide-react";
import { useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setModal } from "@/redux/slices/modalSlice";

const CandidateJobPreference = ({ initialJobPreference }) => {
  const dispatch = useDispatch();

  const openJobPreferenceModal = () => {
    dispatch(
      setModal({
        modalType: "jobPreferenceModal",
        modalProps: { initialJobPreference },
      })
    );
  };

  return (
    <div className="space-y-6 w-full bg-white rounded-xl border p-8">
      {/* Editable Pencil Icon */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl">Job Preferences</h1>
        <div className="flex">
          <Edit
            className="text-gray-500 cursor-pointer"
            onClick={openJobPreferenceModal}
          />
        </div>
      </div>

      {/* Profile Title */}
      <div>
        <label htmlFor="profileTitle" className="text-sm font-semibold">
          Profile Title
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialJobPreference.profileTitle}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label htmlFor="jobType" className="text-sm font-semibold">
          Job Type
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialJobPreference.jobType}
        </div>
      </div>

      {/* Experience */}
      <div className="text-sm font-semibold">
        <h1>Experience (in years)</h1>
        <div className="flex items-center gap-8 justify-between flex-col lg:flex-row">
          {/* Min Experience */}
          <div className="mt-1 p-3 w-full border rounded-md">
            Min: {initialJobPreference.experienceYears}
          </div>

          {/* Max Experience */}
          <div className="mt-1 p-3 w-full border rounded-md">
            Max: {initialJobPreference.experienceMonths}
          </div>
        </div>
      </div>

      {/* Gender */}
      <div>
        <label htmlFor="gender" className="text-sm font-semibold">
          Gender
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialJobPreference.gender}
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dob" className="text-sm font-semibold">
          Date of Birth
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {moment(initialJobPreference.dob).format("DD/MM/YYYY")}
        </div>
      </div>

      {/* Marital Status */}
      <div>
        <label htmlFor="maritalStatus" className="text-sm font-semibold">
          Marital Status
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialJobPreference.maritalStatus}
        </div>
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="text-sm font-semibold">
          Language
        </label>
        <div className="mt-1 p-3 w-full border rounded-md">
          {initialJobPreference.language}
        </div>
      </div>
    </div>
  );
};

export default CandidateJobPreference;
