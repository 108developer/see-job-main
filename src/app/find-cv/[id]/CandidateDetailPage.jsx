"use client";

import SEOModal from "@/app/modals/SEOModal";
import { Loader } from "@/components/ui/loader";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";
import BoyPlaceholderImage from "@/images/boy_default_img.jpg";
import GirlPlaceholderImage from "@/images/girl_default_img.jpg";
import { useGetCandidateProfileQuery } from "@/redux/api/candidateAuth";
import { handleDownloadResume } from "@/utils/HandleDownloadResume";
import { DownloadIcon, FileIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";

const actions = [
  "Email",
  "Forward",
  "Download",
  "Shortlist",
  "Delete",
  "Reject",
  "Hold",
  "WhatsApp",
];

const getValue = (val) =>
  val !== undefined && val !== null && val !== "" ? val : "Not Available";

const formatDate = (date) => {
  return date ? moment(date).format("DD/MM/YYYY") : "Not Available";
};

const CandidateDetailPage = () => {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const { id } = useParams();

  const { data, isLoading, error } = useGetCandidateProfileQuery({ id, jobId });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        Something went wrong.
      </div>
    );

  const {
    registration = {},
    jobPreferences = {},
    education = {},
    questionnaire = [],
    workExperience = [],
    profilePic,
    resume,
  } = data;

  return (
    <div className="p-12 space-y-6">
      <h1 className="text-2xl font-bold ">
        Candidate Details
        {/* {data?.registration?.fullName || "Candidate Details"} */}
      </h1>

      {/* Action Buttons */}
      {/* <div className="flex flex-wrap gap-2 ">
        {actions?.map((action, i) => (
          <button
            key={i}
            className={`border rounded px-3 py-1 text-sm ${
              action === "WhatsApp"
                ? "text-green-500 border-green-500"
                : "text-gray-700 border-gray-300"
            }`}
          >
            {action}
          </button>
        ))}
      </div> */}

      {/* Candidate Overview */}
      <div className="bg-white border rounded shadow-sm p-4  flex flex-col md:flex-row gap-6">
        <SEOModal slug="candidate_details" />
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
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              {/* <Image
                src={profilePic || PlaceholderImage}
                alt={registration.fullName || "Candidate Profile Picture"}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              /> */}
              <Image
                src={
                  profilePic
                    ? profilePic
                    : jobPreferences.gender === "Male"
                    ? BoyPlaceholderImage
                    : jobPreferences.gender === "Female"
                    ? GirlPlaceholderImage
                    : PlaceholderImage
                }
                alt={registration.fullName || "Candidate Profile Picture"}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
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
            <strong>Company:</strong>{" "}
            {workExperience.companyName || "Not Available"}
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
            <strong>Functional Area:</strong>{" "}
            {jobPreferences.industry || "Not Available"}
          </p>
          {/* <p>
            <strong>Industry:</strong>{" "}
            {registration.industry || "Not Available"}
          </p> */}
        </div>
        <div className="space-y-2">
          <p>
            <strong>Total Experience:</strong> {registration.minexp || 0} -{" "}
            {registration.maxexp || 0} Years
          </p>
          <p>
            <strong>CTC:</strong>{" "}
            {jobPreferences?.currentSalary?.toLocaleString() || "Not Available"}{" "}
            /month
          </p>
          <p>
            <strong>Expected CTC:</strong>{" "}
            {jobPreferences?.expectedSalary?.toLocaleString() ||
              "Not Available"}{" "}
            /month
          </p>
          <p>
            <strong>Degree:</strong>{" "}
            {education.highestQualification || "Not Available"}
          </p>
          <p>
            <strong>Notice Period:</strong>{" "}
            {workExperience.noticePeriod || "Not Available"}
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
      {questionnaire?.length > 0 && (
        <div className="bg-white border rounded shadow-sm p-4 space-y-2 gap-6">
          <h3 className="text-lg font-semibold  text-green-600">
            Questionnaire
          </h3>
          <div className="mt-2">
            {questionnaire?.map((answer, index) => {
              return (
                <div key={index} className="mb-3">
                  <strong>
                    Que {index + 1}: {answer.questionText}
                  </strong>
                  <ul className="list-inside list-disc mt-1 ml-4">
                    {answer.answer && (
                      <li>
                        {Array.isArray(answer.answer) ? (
                          <ul className="list-inside list-disc ml-4">
                            {formatAnswer(answer.answer)}
                          </ul>
                        ) : (
                          <span>{answer.answer}</span>
                        )}
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
      {workExperience?.length === 0 ? (
        <p className="text-gray-500">No work experience added yet.</p>
      ) : (
        <div className="bg-white border rounded shadow-sm p-4 space-y-2 gap-6">
          <h3 className="text-lg font-semibold  text-green-600">
            Work Experience
          </h3>

          {workExperience?.map((exp, index) => (
            <div
              key={exp._id || index}
              className="border rounded-lg p-4 space-y-2 relative bg-gray-50"
            >
              <div>
                <span className="font-semibold text-gray-700">Company:</span>{" "}
                {getValue(exp.companyName)}
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="w-full">
                  <span className="font-semibold text-gray-700">
                    Job Title:
                  </span>{" "}
                  {getValue(exp.jobTitle)}
                </div>
                <div className="w-full">
                  <span className="font-semibold text-gray-700">Duration:</span>{" "}
                  {formatDate(exp.startDate)} -{" "}
                  {exp.currentlyEmployed ? "Present" : formatDate(exp.endDate)}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                {/* <div className="w-full">
                  <span className="font-semibold text-gray-700">Industry:</span>{" "}
                  {getValue(exp.industry)}
                </div> */}
                <div className="w-full">
                  <span className="font-semibold text-gray-700">
                    Notice Period:
                  </span>{" "}
                  {getValue(exp.noticePeriod)}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Location:</span>{" "}
                {getValue(exp.location)}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Job Description:
                </span>{" "}
                {getValue(exp.jobDescription)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Language Known */}
      {/* <div className="">
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
      </div> */}

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
              <strong>Category:</strong>{" "}
              {registration.industry || "Not Available"}
            </p>
            <p>
              <strong>Physically Challenged:</strong>{" "}
              {registration.industry || "Not Available"}
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
              <button
                onClick={() =>
                  handleDownloadResume(
                    resume,
                    registration.fullName,
                    registration.email
                  )
                }
                className="bg-blue-600 text-white font-semibold flex items-center gap-2 px-2 py-1 rounded-lg ml-auto"
              >
                <DownloadIcon className="w-4 h-4" />
                Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
