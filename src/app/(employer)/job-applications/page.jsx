"use client";

import FilterSidebar from "@/app/find-cv/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { GET_JOB_APPLICATIONS } from "@/graphql/queries/jobApplication";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";
import { useQuery } from "@apollo/client";
import {
  Award,
  Banknote,
  Briefcase,
  Calendar,
  ChevronDownCircle,
  ChevronUpCircle,
  DownloadIcon,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

// Function to handle the download
const handleDownloadResume = async (resumeUrl, fullName, email) => {
  try {
    const response = await fetch(resumeUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch resume file.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    const filename = `${fullName || "Candidate"}_${email || "NoEmail"}.pdf`;
    link.href = url;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Resume could not be downloaded. Please try again.");
  }
};

const JobApplications = () => {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    jobId: jobId,
    skills: [],
  });

  const router = useRouter();

  const { data, error, loading } = useQuery(GET_JOB_APPLICATIONS, {
    variables: {
      ...filters,
      page: currentPage,
    },
    // skip: !jobId,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (updatedFilters) => {
    setFilters((prevFilters) => {
      const mergedFilters = {
        ...prevFilters,
        ...updatedFilters,
      };

      Object.keys(mergedFilters).forEach((key) => {
        if (
          mergedFilters[key] === null ||
          mergedFilters[key] === "" ||
          mergedFilters[key] === "null" ||
          mergedFilters[key] === "NaN" ||
          (Array.isArray(mergedFilters[key]) && mergedFilters[key].length === 0)
        ) {
          delete mergedFilters[key];
        }
      });

      setCurrentPage(1);
      return mergedFilters;
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatAnswer = (answer) => {
    if (Array.isArray(answer)) {
      return answer.map((opt, idx) => <li key={idx}>{opt}</li>);
    }
    return <span>{answer}</span>;
  };

  const [expandedCandidateId, setExpandedCandidateId] = useState(null);

  const toggleQuestionnaire = (candidateId) => {
    setExpandedCandidateId((prev) =>
      prev === candidateId ? null : candidateId
    );
  };

  const jobApplications = data?.getJobApplications?.jobApplications || [];
  const totalPages = data?.getJobApplications?.totalPages || 1;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="flex w-64 bg-white shadow-lg border-r">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full p-5 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div
              className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-sky-600 rounded-full"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : jobApplications.length === 0 ? (
          <div className="text-center text-xl font-semibold text-gray-600">
            No candidates found for the selected filters.
          </div>
        ) : (
          jobApplications.map((candidate) => (
            <div
              key={candidate.id}
              className="flex flex-col gap-2 bg-white border rounded-lg shadow-md px-8 py-4 w-full mx-auto hover:shadow-lg transition-all"
            >
              {/* Candidate Information Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8 w-full">
                  <Image
                    src={candidate.profilePic || PlaceholderImage}
                    alt={candidate.fullName || "Candidate Profile Picture"}
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-red-600 gap-2 flex items-center">
                      {candidate.fullName || "Not Available"}
                      <small className="text-sm text-gray-600">
                        (<em>{candidate.email || "Not Available"}</em>)
                      </small>
                    </h4>
                    <h6 className="text-sm text-gray-500">
                      Age: {candidate.age || "Not Available"} /{" "}
                      {candidate.gender || "Not Available"}
                    </h6>
                    <span className="text-sm text-gray-600">
                      {candidate.mode || "Not Available"}
                    </span>
                  </div>
                </div>
                <div className="">
                  <button
                    onClick={() =>
                      handleDownloadResume(
                        candidate.resume,
                        candidate.fullName,
                        candidate.email
                      )
                    }
                    className="bg-blue-600 text-white font-semibold flex items-center gap-2 px-2 py-1 rounded-lg ml-auto"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Resume
                  </button>
                </div>
              </div>

              {/* Candidate Details */}
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col w-full">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <UserCheck className="w-4 h-4" />
                      {candidate.jobTitle || "Not Available"}
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <Calendar className="w-4 h-4" />
                      {candidate.experience || "Not Available"} years
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <IndianRupee className="w-4 h-4" />
                      Current Salary: ₹{" "}
                      {candidate?.currentSalary.toLocaleString() ||
                        "Not Available"}
                      /month
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <Banknote className="w-4 h-4" />
                      Expected Salary: ₹
                      {candidate?.expectedSalary.toLocaleString() ||
                        "Not Available"}
                      /month
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <Briefcase className="w-4 h-4" />
                      {candidate.degree || "Not Available"}
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <Award className="w-4 h-4" />
                      {candidate.board || "Not Available"}
                      <Award className="w-4 h-4" />
                      Medium:
                      {candidate.medium || "Not Available"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {candidate.location || "Not Available"}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-1 text-center text-sm bg-gray-100/80">
                  <p>
                    <strong>
                      Shortlisted by{" "}
                      {candidate.shortlistedBy || "Not Available"} Recruiters
                    </strong>
                  </p>
                  <span className="text-sm text-gray-500">
                    <strong>Last Activity:</strong>{" "}
                    {candidate.lastActivity || "Not Available"}
                  </span>
                  <div className="mt-2 flex justify-center gap-4 text-sm">
                    <button className="flex items-center text-sm gap-2 bg-gray-200 text-gray-700 py-1 px-2 rounded-md hover:bg-gray-300">
                      <MessageCircle className="w-4 h-4" />
                      SMS
                    </button>
                    <button>
                      <a
                        href={`mailto:${candidate.email}`}
                        className="flex items-center text-sm gap-2 bg-green-600 text-white py-1 px-2 rounded-md hover:bg-green-700"
                      >
                        <Mail className="w-4 h-4" />
                        MAIL
                      </a>
                    </button>
                    <button>
                      <a
                        href={`tel:${candidate.phone}`}
                        className="flex items-center text-sm gap-2 bg-gray-200 text-gray-700 py-1 px-2 rounded-md hover:bg-gray-300"
                      >
                        <Phone className="w-4 h-4" />
                        CALL
                      </a>
                    </button>
                  </div>

                  <button
                    onClick={() => router.push(`/find-cv/${candidate.id}`)}
                    className="bg-yellow-500 text-white text-sm py-1 px-2 rounded-md mt-4 hover:bg-yellow-600"
                  >
                    View Candidate
                  </button>

                  <div className="mt-4 flex justify-center m-1 gap-2">
                    <button className="flex items-center text-sm gap-2 bg-gray-200 text-gray-700 py-1 px-2 rounded-md hover:bg-gray-300">
                      <UserPlus className="w-4 h-4" />
                      Shortlist
                    </button>
                    <button className="flex items-center text-sm gap-2 bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700">
                      <UserX className="w-4 h-4" />
                      Reject
                    </button>
                    <button className="flex items-center text-sm gap-2 bg-gray-200 text-gray-700 py-1 px-2 rounded-md hover:bg-gray-300">
                      <UserCheck className="w-4 h-4" />
                      Hold
                    </button>
                  </div>
                </div>
              </div>

              {/* Remarks and Skills Section */}
              <div className="bg-gray-100 p-2 rounded-md">
                <div className="flex items-center text-red-600 font-semibold">
                  Key Skills
                </div>

                <p className="mt-2">
                  {candidate.skills && candidate.skills.length > 0
                    ? `${candidate.skills.join(", ")}`
                    : "Not Available"}
                </p>
              </div>

              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleQuestionnaire(candidate.id)}
              >
                <h3 className="font-semibold text-lg text-green-500">
                  Questionnaire
                </h3>
                {expandedCandidateId === candidate.id ? (
                  <ChevronUpCircle className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownCircle className="w-5 h-5 text-gray-500" />
                )}
              </div>
              {expandedCandidateId === candidate.id && (
                <div className="mt-2">
                  {candidate.answers.map((answer, index) => {
                    return (
                      <div key={index} className="mb-3">
                        <strong>
                          Que {index + 1}: {answer.questionText}
                        </strong>
                        <ul className="list-inside list-disc mt-1 ml-4">
                          {/* Check answer type and format accordingly */}
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
              )}
            </div>
          ))
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default JobApplications;
