"use client";

import SEOModal from "@/app/modals/SEOModal";
import { Loader } from "@/components/ui/loader";
import { useGetEmployerProfileQuery } from "@/redux/api/employerAuth";
import { setModal } from "@/redux/slices/modalSlice";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EmployerProfile = () => {
  const { userid, token } = useSelector((state) => state.auth);
  const [employerData, setEmployerData] = useState({});

  const { data, isLoading, error } = useGetEmployerProfileQuery({
    userid,
    token,
  });

  useEffect(() => {
    if (data) {
      setEmployerData({
        ...data?.data,
        userid,
        token,
      });
    }
  }, [data, userid, token]);

  const dispatch = useDispatch();

  const openRecruiterProfileModal = () => {
    dispatch(
      setModal({
        modalType: "recruiterProfileModal",
        modalProps: { employerData },
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  }

  if (error) {
    console.log("ERROR: ", error);
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Error loading profile data... {error.data.message}
      </div>
    );
  }

  if (!employerData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        No employer data available.
      </div>
    );
  }

  return (
    <div className="flex w-full px-4 md:px-10 lg:px-28 py-8">
      <SEOModal slug="employer_profile" />
      <div className="space-y-6 w-full bg-white rounded-xl border p-8">
        {/* Editable Pencil Icon */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl">Employer Profile</h1>
          <div className="flex">
            <Edit
              className="text-gray-500 cursor-pointer"
              onClick={openRecruiterProfileModal}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
          {/* Full Name */}
          <div className="w-full">
            <label htmlFor="firstName" className="text-sm font-semibold">
              First Name
            </label>
            <div className="w-full">
              {employerData?.firstName || "Not available"}
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="text-sm font-semibold">
              Last Name
            </label>
            <div className="w-full">
              {employerData?.lastName || "Not available"}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
          {/* Email */}
          <div className="w-full">
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <div className="w-full">
              {employerData?.email || "Not available"}
            </div>
          </div>

          {/* Phone */}
          <div className="w-full">
            <label htmlFor="phone" className="text-sm font-semibold">
              Phone
            </label>
            <div className="flex items-center">
              +91 {employerData?.mobileNumber || "Not available"}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="text-sm font-semibold">
            Current Location
          </label>
          <div className="w-full">
            {employerData?.location || "Not available"}
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="text-sm font-semibold">
            Full Address
          </label>
          <div className="w-full">
            {employerData?.address || "Not available"}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
          {/* Company Name */}
          <div className="w-full">
            <label htmlFor="companyName" className="text-sm font-semibold">
              Company Name
            </label>
            <div className="w-full">
              {employerData?.companyName || "Not available"}
            </div>
          </div>

          {/* Designation */}
          <div className="w-full">
            <label htmlFor="designation" className="text-sm font-semibold">
              Designation
            </label>
            <div className="w-full">
              {employerData?.designation || "Not available"}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="text-sm font-semibold">
            Description
          </label>
          <div className="w-full">
            {employerData?.description || "Not available"}
          </div>
        </div>

        {/* City */}
        {/* <div>
          <label htmlFor="city" className="text-sm font-semibold">
            City
          </label>
          <div className="w-full">{employerData?.city || "Not available"}</div>
        </div> */}

        {/* Zip Code */}
        {/* <div>
          <label htmlFor="zipCode" className="text-sm font-semibold">
            Zip Code
          </label>
          <div className="w-full">
            {employerData?.zipCode || "Not available"}
          </div>
        </div> */}

        {/* State */}
        {/* <div>
          <label htmlFor="state" className="text-sm font-semibold">
            State
          </label>
          <div className="w-full">{employerData?.state || "Not available"}</div>
        </div> */}

        {/* Total Experience */}
        {/* <div>
          <label htmlFor="totalExperience" className="text-sm font-semibold">
            Total Experience
          </label>
          <div className="w-full">
            {employerData?.totalExperience || "Not available"}
          </div>
        </div> */}

        {/* Level */}
        {/* <div>
          <label htmlFor="level" className="text-sm font-semibold">
            Level
          </label>
          <div className="w-full">{employerData?.level || "Not available"}</div>
        </div> */}

        {/* Industry */}
        {/* <div>
          <label htmlFor="industry" className="text-sm font-semibold">
            Industry
          </label>
          <div className="w-full">
            {employerData?.industry || "Not available"}
          </div>
        </div> */}

        {/* Achievements */}
        {/* <div>
          <label htmlFor="achievements" className="text-sm font-semibold">
            Achievements
          </label>
          <div className="w-full">
            {employerData?.achievements || "Not available"}
          </div>
        </div> */}

        {/* Key Skills */}
        {/* <div>
          <label htmlFor="skills" className="text-sm font-semibold">
            Key Skills
          </label>
          <div className="mt-1 w-full flex flex-wrap gap-2">
            {(employerData?.skills || []).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
            {(employerData?.skills || []).length === 0 && (
              <span className="text-gray-500">Not available</span>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default EmployerProfile;
