"use client";

import JobApply from "@/app/Joblisting/JobApply";
import { Loader } from "@/components/ui/loader";
import { useGetJobByIdQuery, useGetJobByUrlQuery } from "@/redux/api/jobApi";
import { formatTime } from "@/utils/formatTime";
import { getTimeSincePosted } from "@/utils/getTimeSincePosted";
import {
  Banknote,
  CheckCircle,
  Heart,
  MapPin,
  PhoneCall,
  Star,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import JobApply from "../JobApply";

import { useMemo } from "react";

const JobDetail = ({}) => {
  const searchParams = useParams();
  const slug = searchParams.slug;
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const { data, error, isLoading } = useGetJobByUrlQuery(slug, {
    skip: !slug,
  });

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    setUserRole(roleFromStorage);
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load job details.
      </div>
    );
  }

  const job = data?.job;

  if (!job) {
    return (
      <div className="text-gray-600 text-center mt-10">
        No job details available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full mx-auto">
      {/* Job Card */}

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="flex flex-col w-full">
            <h5 className="text-xl font-semibold mb-1">{job.jobTitle}</h5>
            <p className="text-gray-600 text-sm mb-2">{job.companyName}</p>
          </div>

          <div className="flex justify-end space-x-4 mb-4">
            <button
              className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 transition px-3 py-1 rounded text-sm whitespace-nowrap"
              onClick={() => setIsApplyModalOpen(true)}
            >
              <Heart className="w-4 h-4" />
              Apply now
            </button>
            {userRole === "candidate" && (
              <button className="flex items-center gap-2 text-blue-600 border border-red-600 hover:bg-blue-600 hover:text-white transition px-3 py-1 rounded text-sm whitespace-nowrap">
                <PhoneCall className="w-4 h-4" />
                Call now
              </button>
            )}
          </div>
        </div>

        <p className="flex gap-2 items-center text-sm">
          <CheckCircle className="mr-1 h-3 w-3" />
          {job.experience.min} - {job.experience.max} Years Experience
        </p>
        <p className="flex gap-2 items-center text-sm">
          <Banknote className="mr-1 h-3 w-3" />₹ {job.monthlySalary.min} -{" "}
          {job.monthlySalary.max}
        </p>
        <p className="flex gap-2 items-center text-sm">
          <MapPin className="mr-1 h-3 w-3" />
          {job.jobLocation}
        </p>
        <div className="flex flex-col w-full text-sm text-gray-500 mt-2">
          <span className="flex gap-2 whitespace-nowrap">
            <em>Openings:</em> <strong>{job?.openings}</strong>
          </span>
          {/* <span className="flex gap-2 whitespace-nowrap">
            <em>Deadline:</em> <strong>{formatTime(job?.deadline)}</strong>
          </span> */}
        </div>

        {/*  ------------------------------------------------------ */}

        <hr className="my-4" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-2">
          <div className="flex flex-col md:flex-row md:items-center w-full gap-2 text-sm text-gray-500">
            <span>
              <em>Posted:</em>{" "}
              <strong>{getTimeSincePosted(job.createdAt)}</strong>
            </span>
            <span>
              <em>Job applicants:</em>{" "}
              <strong>{data?.applicationCount} applicants</strong>
            </span>
          </div>
          <div className="flex items-center gap-1 md:justify-end text-blue-600 text-sm cursor-pointer hover:underline w-full">
            <Star className="w-4 h-4" /> Send More Jobs Like This
          </div>
        </div>
      </div>

      {/* Job Description Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h6 className="text-lg font-semibold mb-3">Job description</h6>
        <p className="flex text-sm">{job.jobDescription}</p>

        <div className="mt-6">
          <h6 className="text-sm text-gray-500 mb-1">Role</h6>
          <p className="text-blue-600 text-sm hover:underline">
            {job?.role || "Not Mentioned"}
          </p>

          {/* <h6 className="text-sm text-gray-500 mt-4 mb-1">Industry Type</h6>
          <p className="text-blue-600 text-sm hover:underline">
            {job?.industry || "Not Mentioned"}
          </p> */}

          {/* <h6 className="text-sm text-gray-500 mt-4 mb-1">Function Area</h6>
          <p className="text-blue-600 text-sm hover:underline">
            {job?.jobArea || "Not Mentioned"}
          </p> */}

          <h6 className="text-sm text-gray-500 mt-4 mb-1">Employment Type</h6>
          <p className="text-blue-600 text-sm hover:underline">
            {job?.jobType}
          </p>

          {/* <h6 className="text-sm text-gray-500 mt-4 mb-1">Role Category</h6>
          <p className="text-blue-600 text-sm hover:underline">
            {job?.roleCategory || "Not Mentioned"}
          </p> */}
        </div>

        <div className="mt-6">
          <h6 className="text-sm text-gray-500 mb-1">Education</h6>
          <p className="text-blue-600 text-sm hover:underline">
            {job?.education || "Not Mentioned"}
          </p>
        </div>

        <div className="mt-6">
          <h6 className="text-sm text-gray-500 mb-2">Key Skills</h6>
          <div className="flex flex-wrap gap-2">
            {job?.skillsRequired?.length > 0 ? (
              job.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">Not mentioned</p>
            )}
          </div>
        </div>

        <hr className="my-6" />
        <div className="flex space-x-4 text-2xl text-gray-600">
          <a href="#">
            <i className="fab fa-facebook-square"></i>
          </a>
          <a href="#" className="text-red-500">
            <i className="fab fa-google-plus-square"></i>
          </a>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h6 className="text-lg font-semibold mb-3">About Company</h6>

        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium text-gray-600">Name:</span>{" "}
          {job?.companyName || "Not Mentioned"}
        </p>

        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium text-gray-600">Email:</span>{" "}
          {job?.companyEmail || "Not Mentioned"}
        </p>

        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium text-gray-600">Phone:</span>{" "}
          {job?.companyPhone || "Not Mentioned"}
        </p>

        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium text-gray-600">Website:</span>{" "}
          {job?.companyWebsite ? (
            <a
              href={job.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {`https://${job.companyWebsite}`}
            </a>
          ) : (
            "Not Mentioned"
          )}
        </p>

        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium text-gray-600">Address:</span>{" "}
          {job?.jobLocation || "Not Mentioned"}
        </p>

        <p className="text-sm text-gray-700 mb-2">
          <span className="font-medium text-gray-600">Description:</span>{" "}
          {job?.companyDescription || "Not Mentioned"}
        </p>
      </div>

      {isApplyModalOpen && (
        <JobApply
          jobId={job._id}
          questions={job.questions}
          closeModal={() => setIsApplyModalOpen(false)}
        />
      )}
    </div>
  );
};

export default JobDetail;
