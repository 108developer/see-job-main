"use client";

import { useGetCandidateProfileQuery } from "@/redux/api/candidateAuth";
import { FileIcon, FilesIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";

const CandidateDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetCandidateProfileQuery({ id });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        Something went wrong.
      </div>
    );

  const formatResumeName = () => {};

  const registration = data?.registration || {};
  const jobPreferences = data?.jobPreferences || {};
  const education = data?.candidateEducation || {};

  return (
    <div className="p-12 space-y-6">
      <h1 className="text-2xl font-bold ">
        {data?.registration?.fullName || "Candidate Name"}
      </h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 ">
        {[
          "Email",
          "Forward",
          "Download",
          "Shortlist",
          "Delete",
          "Reject",
          "Hold",
          "WhatsApp",
        ].map((action, i) => (
          <button
            key={i}
            className={`btn btn-sm border rounded px-3 py-1 text-sm ${
              action === "WhatsApp"
                ? "text-green-500 border-green-500"
                : "text-gray-700 border-gray-300"
            }`}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Candidate Overview */}
      <div className="bg-white border rounded shadow-sm p-4  flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center space-y-2 w-full">
          <div className="flex justify-between w-full ">
            <div className="flex flex-col">
              <h4 className="text-xl font-semibold text-red-600 gap-2 flex items-center">
                {registration.fullName || "Candidate Name"}
              </h4>
              <p className="text-gray-600 text-sm">
                {registration.jobDescription ||
                  "Post Graduate, 2 years 8 months experience in Software Development"}
              </p>
            </div>
            <Image
              src={data?.profilePic || PlaceholderImage}
              alt={registration.fullName || "Candidate Profile Picture"}
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="w-full h-[1px] bg-gray-100"></div>
          <div className="flex items-center gap-4 w-full">
            <p>
              <strong>Email:</strong> {registration.email || "Not Available"}
            </p>
            <p>
              <strong>Phone:</strong> {registration.phone || "Not Available"}
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white border rounded shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <p>
            <strong>Designation:</strong>{" "}
            {jobPreferences.profileTitle || "Not Available"}
          </p>
          <p>
            <strong>Company:</strong> ABC Pvt Ltd.
          </p>
          <p>
            <strong>Current Location:</strong>{" "}
            {registration.location || "Not Available"}
          </p>
          <p>
            <strong>Preferred Location:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-600">
            {jobPreferences.preferredJobLocation?.length > 0 ? (
              jobPreferences.preferredJobLocation.map((location, index) => (
                <li key={index}>{location}</li>
              ))
            ) : (
              <li>Not Available</li>
            )}
          </ul>

          <p>
            <strong>Functional Area:</strong> Other
          </p>
          <p>
            <strong>Industry:</strong>{" "}
            {registration.industry || "Not Available"}
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <strong>Total Experience:</strong> {registration.minexp || 0} -{" "}
            {registration.maxexp || 0} Years
          </p>
          <p>
            <strong>CTC:</strong>{" "}
            {jobPreferences?.currentSalary.toLocaleString() || "Not Available"}{" "}
            /month
          </p>
          <p>
            <strong>Expected CTC:</strong>{" "}
            {jobPreferences?.expectedSalary.toLocaleString() || "Not Available"}{" "}
            /month
          </p>
          <p>
            <strong>Degree:</strong>{" "}
            {education.highestQualification || "Not Available"}
          </p>
          <p>
            <strong>Notice Period:</strong> 15 Days or Less
          </p>
        </div>
      </div>

      {/* Key Skills */}
      <div className="bg-white border rounded shadow-sm p-4 flex flex-col md:flex-row gap-6 items-center">
        <h3 className="text-lg font-semibold text-green-600">Key Skills</h3>
        <p className="text-gray-600">
          {data?.registration?.skills && data?.registration?.skills.length > 0
            ? `${data?.registration?.skills.join(", ")}`
            : "Not Available"}
        </p>
      </div>

      {/* Questionnaire */}
      <div className="bg-white border rounded shadow-sm p-4 space-y-2 gap-6">
        <h3 className="text-lg font-semibold  text-green-600">Questionnaire</h3>
        <p className="text-gray-700">
          <strong>1. Do you know Drupal?</strong>
        </p>
        <p className="text-gray-600">A. No</p>
      </div>

      <div className="bg-white border rounded shadow-sm p-4  gap-6 text-gray-500">
        SeeJob.com does not promise a job or an interview in exchange for money.
        Fraudsters may ask you to pay under the pretext of a registration fee or
        a refundable fee.
      </div>

      {/* Education */}
      <div className="bg-white border rounded shadow-sm p-4 space-y-2 gap-6">
        <h3 className="text-lg font-semibold  text-green-600">Education</h3>
        <p className="text-gray-700">
          {education.highestQualification || "N/A"} -{" "}
          {education.boardOfEducation?.toUpperCase() || "N/A"} Board |{" "}
          {education.yearOfEducation || "N/A"}
        </p>
      </div>

      {/* Work Experience */}
      <div className="bg-white border rounded shadow-sm p-4 space-y-2 gap-6">
        <h3 className="text-lg font-semibold  text-green-600">
          Work Experience
        </h3>
        <p className="text-gray-700">
          {registration.jobDescription || "Not Available"}
        </p>
        <p className="text-gray-700">Post Graduate (Distance Learning)</p>
        <p className="text-gray-600">MA (English), IGNOU | 2005</p>
      </div>

      {/* Language Known */}
      <div className="">
        <h3 className="text-lg font-semibold  text-green-600">
          Languages Known
        </h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Language</th>
              <th className="border px-2 py-1">Proficiency</th>
              <th className="border px-2 py-1">Read</th>
              <th className="border px-2 py-1">Write</th>
            </tr>
          </thead>
          <tbody>
            {[
              { language: "English", level: "Proficient" },
              { language: "Hindi", level: "Proficient" },
            ].map((lang, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{lang.language}</td>
                <td className="border px-2 py-1">{lang.level}</td>
                <td className="border px-2 py-1 text-green-600">✔</td>
                <td className="border px-2 py-1 text-green-600">✔</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Other Details */}
      <div className="bg-white border rounded shadow-sm p-4 gap-6">
        <h3 className="text-lg font-semibold  text-green-600">Other Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2 text-sm items-center">
          <div className="space-y-2">
            <p>
              <strong>DOB:</strong>{" "}
              {jobPreferences.dob
                ? new Date(jobPreferences.dob).toLocaleDateString()
                : "Not Available"}
            </p>
            <p>
              <strong>Gender:</strong>{" "}
              {jobPreferences.gender || "Not Available"}
            </p>
            <p>
              <strong>Marital Status:</strong>{" "}
              {jobPreferences.maritalStatus || "Not Available"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {registration.location || "Not Available"}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Job Type:</strong>{" "}
              {jobPreferences.jobType || "Not Available"}
            </p>
            <p>
              <strong>Work Auth:</strong> Not Mentioned
            </p>
            <p>
              <strong>Category:</strong> General
            </p>
            <p>
              <strong>Physically Challenged:</strong> No
            </p>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white border rounded shadow-sm p-4 flex flex-col gap-6 ">
        <h3 className="text-lg font-semibold  text-green-600">
          Attached Documents
        </h3>
        <div className="">
          <h3 className="text-lg font-semibold  text-green-600">Resume</h3>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 flex justify-center items-center rounded-full">
              <FileIcon className="text-gray-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm">
                <a
                  href={registration.resume || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download Resume
                </a>
              </p>
              <p className="text-xs text-gray-500">Added on 24 Dec 2020</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
