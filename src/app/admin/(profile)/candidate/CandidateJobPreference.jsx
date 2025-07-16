"use client";

import { Edit } from "lucide-react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { setModal } from "@/redux/slices/modalSlice";

const CandidateJobPreference = ({ initialJobPreference }) => {
  const dispatch = useDispatch();

  const openJobPreferenceModal = () => {
    dispatch(
      setModal({
        modalType: "jobPreferenceModal",
        modalProps: {
          initialJobPreference: {
            ...initialJobPreference,
            dob: initialJobPreference.dob
              ? typeof initialJobPreference.dob === "string"
                ? initialJobPreference.dob
                : initialJobPreference.dob.toISOString()
              : null,
          },
        },
      })
    );
  };

  const formatArrayValue = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Not Available";
    }
    return getValue(value);
  };

  const getValue = (value) =>
    value !== undefined && value !== null && value !== ""
      ? value
      : "Not Available";

  return (
    <div className="space-y-6 w-full bg-white rounded-xl border p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl">Job Preferences</h1>
        <div className="flex">
          <Edit
            className="text-gray-500 cursor-pointer"
            onClick={openJobPreferenceModal}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between w-full">
        {/* Profile Title */}
        <div className="w-full">
          <label
            htmlFor="profileTitle"
            className="text-sm font-semibold text-gray-700"
          >
            Profile Title
          </label>
          <div className="text-gray-500">
            {getValue(initialJobPreference?.profileTitle)}
          </div>
        </div>

        {/* Job Type */}
        <div className="w-full">
          <label
            htmlFor="jobType"
            className="text-sm font-semibold text-gray-700"
          >
            Job Type
          </label>
          <div className="text-gray-500">
            {formatArrayValue(initialJobPreference?.jobType)}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between w-full">
        {/* Current Salary */}
        <div className="w-full">
          <label
            htmlFor="currentSalary"
            className="text-sm font-semibold text-gray-700"
          >
            Current Salary
          </label>
          <div className="text-gray-500">
            {getValue(initialJobPreference?.currentSalary)}
          </div>
        </div>

        {/* Expected Salary */}
        <div className="w-full">
          <label
            htmlFor="expectedSalary"
            className="text-sm font-semibold text-gray-700"
          >
            Expected Salary
          </label>
          <div className="text-gray-500">
            {getValue(initialJobPreference?.expectedSalary)}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between w-full">
        {/* Gender */}
        <div className="w-full">
          <label
            htmlFor="gender"
            className="text-sm font-semibold text-gray-700"
          >
            Gender
          </label>
          <div className="text-gray-500">
            {getValue(initialJobPreference?.gender)}
          </div>
        </div>

        {/* Marital Status */}
        <div className="w-full">
          <label
            htmlFor="maritalStatus"
            className="text-sm font-semibold text-gray-700"
          >
            Marital Status
          </label>
          <div className="text-gray-500">
            {getValue(initialJobPreference?.maritalStatus)}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center justify-between w-full">
        {/* Language */}
        <div className="w-full">
          <label
            htmlFor="language"
            className="text-sm font-semibold text-gray-700"
          >
            Language
          </label>
          <div className="text-gray-500">
            {formatArrayValue(initialJobPreference?.language)}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="w-full">
          <label htmlFor="dob" className="text-sm font-semibold text-gray-700">
            Date of Birth
          </label>
          <div className="text-gray-500">
            {initialJobPreference?.dob
              ? moment(initialJobPreference.dob).format("DD/MM/YYYY")
              : "Not Available"}
          </div>
        </div>
      </div>

      {/* Preferred Job Location */}
      <div>
        <label
          htmlFor="preferredJobLocation"
          className="text-sm font-semibold text-gray-700"
        >
          Preferred Job Location
        </label>
        <div className="text-gray-500">
          {initialJobPreference?.preferredJobLocation?.length > 0 ? (
            initialJobPreference.preferredJobLocation.map((location, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md mb-2"
              >
                <span>{getValue(location)}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
              <span>Not Available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateJobPreference;
