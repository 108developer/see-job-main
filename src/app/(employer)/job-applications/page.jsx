"use client";

import FilterSidebar from "@/app/find-cv/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { Loader } from "@/components/ui/loader";
import { UPDATE_APPLICATION_STATUS } from "@/graphql/mutations/jobApplication";
import { GET_JOB_APPLICATIONS } from "@/graphql/queries/jobApplication";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";
import { setModal } from "@/redux/slices/modalSlice";
import { handleDownloadResume } from "@/utils/HandleDownloadResume";
import { useMutation, useQuery } from "@apollo/client";
import {
  Banknote,
  Briefcase,
  Calendar,
  ChevronDownCircle,
  ChevronUpCircle,
  DownloadIcon,
  Eye,
  EyeOff,
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const status = ["All", "Viewed", "Shortlisted", "Rejected", "Hold"];

const statusStyles = {
  All: "bg-gray-600 text-white hover:bg-gray-700 font-semibold",
  Viewed: "bg-blue-600 text-white hover:bg-blue-700 font-semibold",
  Shortlisted: "bg-green-600 text-white hover:bg-green-700 font-semibold",
  Rejected: "bg-red-600 text-white hover:bg-red-700 font-semibold",
  Hold: "bg-yellow-500 text-white hover:bg-yellow-600 font-semibold",
};

const iconMap = {
  Shortlisted: <UserPlus className="w-4 h-4" />,
  Rejected: <UserX className="w-4 h-4" />,
  Hold: <UserCheck className="w-4 h-4" />,
  Viewed: <Eye className="w-4 h-4" />,
};

const formatAnswer = (answer) => {
  if (Array.isArray(answer)) {
    return answer.map((opt, idx) => <li key={idx}>{opt}</li>);
  }
  return <span>{answer}</span>;
};

const JobApplications = () => {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loadingStatus, setLoadingStatus] = useState({});
  const [candidateStatusMap, setCandidateStatusMap] = useState({});
  const [expandedCandidateId, setExpandedCandidateId] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const [shownEmails, setShownEmails] = useState(new Set());
  const [shownPhones, setShownPhones] = useState(new Set());
  const [shownWhatsApps, setShownWhatsApps] = useState(new Set());
  const [allowedToVisit, setAllowedToVisit] = useState(new Set());

  const [updateStatusMutation] = useMutation(UPDATE_APPLICATION_STATUS);

  const { userid, token, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && role !== "employer" && role !== "recruiter") {
      router.push("/");
    }
  }, [token, role, router]);

  const updateCandidateStatus = async (candidateId, newStatus) => {
    const currentStatus = candidateStatusMap[candidateId] || "All";

    if (currentStatus === newStatus) {
      return;
    }

    const previousStatus = currentStatus;

    setLoadingStatus((prev) => ({
      ...prev,
      [candidateId]: true,
    }));

    try {
      setCandidateStatusMap((prev) => ({
        ...prev,
        [candidateId]: newStatus,
      }));

      const { data } = await updateStatusMutation({
        variables: {
          applicationId: candidateId,
          status: newStatus,
          recruiterId: userid,
        },
      });

      if (data?.updateJobApplicationStatus?.success) {
        toast.success(data?.updateJobApplicationStatus?.message);
      } else {
        toast.error(
          data?.updateJobApplicationStatus?.message ||
            "Failed to update status."
        );
        setCandidateStatusMap((prev) => ({
          ...prev,
          [candidateId]: previousStatus,
        }));
      }
    } catch (error) {
      toast.error("Failed to update status. Please try again.");
      setCandidateStatusMap((prev) => ({
        ...prev,
        [candidateId]: previousStatus,
      }));
    } finally {
      setLoadingStatus((prev) => ({
        ...prev,
        [candidateId]: false,
      }));
    }
  };

  useEffect(() => {
    const statusValue = selectedStatus === "All" ? "" : selectedStatus;
    handleFilterChange({ status: statusValue });
  }, [selectedStatus]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    jobId: jobId,
    skills: [],
  });

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

  const toggleQuestionnaire = (candidateId) => {
    setExpandedCandidateId((prev) =>
      prev === candidateId ? null : candidateId
    );
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates((prevSelected) =>
      prevSelected.includes(candidateId)
        ? prevSelected.filter((id) => id !== candidateId)
        : [...prevSelected, candidateId]
    );
  };

  const showEmail = (id) => {
    setShownEmails((prev) => new Set(prev).add(id));
    setAllowedToVisit((prev) => new Set(prev).add(id));
  };

  const showPhone = (id) => {
    setShownPhones((prev) => new Set(prev).add(id));
    setAllowedToVisit((prev) => new Set(prev).add(id));
  };

  const showWhatsApp = (id) => {
    setShownWhatsApps((prev) => new Set(prev).add(id));
    setAllowedToVisit((prev) => new Set(prev).add(id));
  };

  const dispatch = useDispatch();

  const openSendMailsModal = () => {
    const selectedCandidatesData = jobApplications
      .filter((candidate) => selectedCandidates.includes(candidate.id))
      .map((candidate) => ({
        id: candidate.id,
        fullName: candidate.fullName,
        email: candidate.email,
      }));

    dispatch(
      setModal({
        modalType: "sendMailsModal",
        modalProps: {
          candidates: selectedCandidatesData,
        },
      })
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
        <div className="flex gap-4 mb-6">
          {status.map((label, idx) => {
            const isActive = selectedStatus === label;
            const activeColor = statusStyles[label];
            return (
              <button
                key={idx}
                onClick={() => setSelectedStatus(label)}
                className={`${
                  isActive ? activeColor : "bg-gray-400 text-gray-600"
                } px-4 py-2 rounded-md font-semibold hover:${activeColor} flex items-center gap-2 transition-colors duration-300`}
              >
                {iconMap[label]} {label}
              </button>
            );
          })}
          {selectedCandidates && selectedCandidates.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <div
                onClick={() => {
                  const allIds = jobApplications.map(
                    (candidate) => candidate.id
                  );
                  setSelectedCandidates(allIds);
                }}
                className="ml-auto bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors duration-300 cursor-pointer"
              >
                Select All
              </div>
              <div
                onClick={() => setSelectedCandidates([])}
                className="ml-auto bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors duration-300 cursor-pointer"
              >
                Cancel
              </div>

              <div
                onClick={openSendMailsModal}
                className="ml-auto bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors duration-300 cursor-pointer"
              >
                Send Mail
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
            <Loader count={5} height={50} className="mb-4" />
          </div>
        ) : jobApplications.length === 0 ? (
          <div className="flex items-center justify-center h-screen text-center text-xl font-semibold text-gray-600">
            No candidates found for the selected filters.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {jobApplications.map((candidate) => {
              const currentStatus =
                candidateStatusMap[candidate.id] || candidate.status;

              return (
                <div key={candidate.id} className="flex gap-2">
                  <div className="">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => toggleCandidateSelection(candidate.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </div>
                  <div
                    key={candidate.id}
                    className="flex flex-col gap-2 bg-white border rounded-lg shadow-md px-8 py-4 w-full mx-auto hover:shadow-lg transition-all"
                  >
                    {/* Candidate Details */}
                    <div className="flex justify-between w-full gap-2">
                      <div className="flex flex-col w-full gap-2">
                        {/* <div className="flex items-center gap-2"> */}
                        <div className="flex items-center gap-2 w-full">
                          <UserCheck className="w-4 h-4" />
                          {candidate.jobTitle || "Not Available"}
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <Calendar className="w-4 h-4" />
                          Experience : {candidate.experience ||
                            "Not Available"}{" "}
                          years
                        </div>
                        {/* </div> */}

                        {/* <div className="flex items-center gap-2"> */}
                        <div className="flex items-center gap-2 w-full">
                          <IndianRupee className="w-4 h-4" />
                          Current Salary : ₹{" "}
                          {candidate?.currentSalary.toLocaleString() ||
                            "Not Available"}
                          /month
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <Banknote className="w-4 h-4" />
                          Expected Salary : ₹{" "}
                          {candidate?.expectedSalary.toLocaleString() ||
                            "Not Available"}
                          /month
                        </div>
                        {/* </div> */}

                        {/* <div className="flex items-center gap-2"> */}
                        <div className="flex items-center gap-2 w-full">
                          <Briefcase className="w-4 h-4" />
                          {candidate.degree || "Not Available"}
                        </div>
                        {/* <div className="flex items-center gap-2 w-full">
                          <Award className="w-4 h-4" />
                          {candidate.board || "Not Available"}
                          <Award className="w-4 h-4" />
                          Medium:
                          {candidate.medium || "Not Available"}
                        </div> */}
                        {/* </div> */}

                        <div className="flex items-center gap-2 w-full">
                          <MapPin className="w-4 h-4" />
                          {candidate.location || "Not Available"}
                        </div>

                        {/* Remarks and Skills Section */}
                        <div className="flex mt-2 gap-2">
                          <div className="text-red-600 font-semibold">
                            Skills
                          </div>

                          {candidate.skills && candidate.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">Not Available</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-2 text-center text-sm bg-gray-100/80 gap-4 flex flex-col w-72">
                        <div className="flex space-x-2 w-full">
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={candidate.profilePic || PlaceholderImage}
                              alt={
                                candidate.fullName ||
                                "Candidate Profile Picture"
                              }
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="w-full flex flex-col p-1 ">
                            <Link
                              href={{
                                pathname: `/find-cv/${candidate.candidateId}`,
                                query: {
                                  jobId,
                                },
                              }}
                            >
                              <div className="text-xl font-semibold text-red-600 gap-2 flex flex-wrap ">
                                {candidate.fullName || "Not Available"}
                              </div>
                            </Link>
                            <div className="text-sm text-gray-500 flex">
                              Age: {candidate.age || "Not Available"} /{" "}
                              {candidate.gender || "Not Available"}
                            </div>
                            <div className="text-sm text-gray-600 flex">
                              {candidate.mode || "Not Available"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="">
                            <div className="flex text-xs">
                              Shortlisted by {candidate.shortlistedBy || "0"}{" "}
                              Recruiters
                            </div>
                            <div className="text-xs flex text-gray-500">
                              Last Activity:{" "}
                              {candidate.lastActivity || "Not Available"}
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

                        <div className="flex flex-col justify-center gap-2 text-sm">
                          <button
                            onClick={() => {
                              showEmail(candidate.id);
                            }}
                            className="flex items-center text-xs gap-2 min-w-32 bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300"
                          >
                            <Mail className="w-4 h-4" />
                            {shownEmails.has(candidate.id)
                              ? candidate.email
                              : "EMAIL"}
                            {shownEmails.has(candidate.id) ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>

                          <div className="flex items-center justify-between gap-2 text-sm w-full">
                            {/* Phone Button */}
                            <button
                              onClick={() => {
                                showPhone(candidate.id);
                              }}
                              className="flex items-center text-xs font-semibold gap-2 min-w-32 bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700"
                            >
                              <Phone className="w-4 h-4" />
                              {shownPhones.has(candidate.id)
                                ? candidate.phone
                                : "PHONE"}
                              {shownPhones.has(candidate.id) ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>

                            {/* WhatsApp Button */}
                            <button
                              onClick={() => showWhatsApp(candidate.id)}
                              className="flex items-center text-xs font-semibold gap-2 min-w-32 bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {shownWhatsApps.has(candidate.id)
                                ? candidate.phone
                                : "WHATSAPP"}
                              {shownWhatsApps.has(candidate.id) ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <Link
                          href={{
                            pathname: `/find-cv/${candidate.candidateId}`,
                            query: { jobId },
                          }}
                        >
                          <div
                            onClick={(e) => {
                              if (!allowedToVisit.has(candidate.id)) {
                                e.preventDefault();
                                toast.warn(
                                  "Please reveal contact info to view details."
                                );
                                return;
                              }

                              if (
                                (candidateStatusMap[candidate.id] ||
                                  candidate.status) !== "Viewed"
                              ) {
                                e.stopPropagation();
                                updateCandidateStatus(candidate.id, "Viewed");
                              }
                            }}
                            className={`flex items-center justify-center w-full cursor-pointer rounded-md text-sm gap-1 px-2 py-1 ${
                              (candidateStatusMap[candidate.id] ||
                                candidate.status) === "Viewed"
                                ? statusStyles["Viewed"]
                                : "bg-gray-400 text-gray-700 hover:text-white hover:bg-blue-600"
                            }`}
                          >
                            {iconMap["Viewed"]}
                            {(candidateStatusMap[candidate.id] ||
                              candidate.status) === "Viewed"
                              ? "Viewed"
                              : "View Details"}
                          </div>
                        </Link>

                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              updateCandidateStatus(candidate.id, "Shortlisted")
                            }
                            disabled={
                              currentStatus === "Shortlisted" ||
                              loadingStatus[candidate.id]
                            }
                            className={`flex items-center gap-1 p-2 rounded-md ${
                              (candidateStatusMap[candidate.id] ||
                                candidate.status) === "Shortlisted"
                                ? statusStyles["Shortlisted"]
                                : "bg-green-300 text-gray-700 hover:text-white hover:bg-green-600 text-xs w-24"
                            }`}
                          >
                            {iconMap["Shortlisted"]}
                            {(candidateStatusMap[candidate.id] ||
                              candidate.status) === "Shortlisted"
                              ? "Shortlisted"
                              : "Shortlist"}
                          </button>

                          <button
                            onClick={() =>
                              updateCandidateStatus(candidate.id, "Rejected")
                            }
                            disabled={
                              currentStatus === "Rejected" ||
                              loadingStatus[candidate.id]
                            }
                            className={`flex items-center gap-1 w p-2 rounded-md ${
                              (candidateStatusMap[candidate.id] ||
                                candidate.status) === "Rejected"
                                ? statusStyles["Rejected"]
                                : "bg-red-300 text-gray-700 hover:text-white hover:bg-red-600 text-xs w-20"
                            }`}
                          >
                            {iconMap["Rejected"]}
                            {(candidateStatusMap[candidate.id] ||
                              candidate.status) === "Rejected"
                              ? "Rejected"
                              : "Reject"}
                          </button>

                          <button
                            onClick={() =>
                              updateCandidateStatus(candidate.id, "Hold")
                            }
                            disabled={
                              currentStatus === "Hold" ||
                              loadingStatus[candidate.id]
                            }
                            className={`flex items-center gap-1 p-2 rounded-md ${
                              (candidateStatusMap[candidate.id] ||
                                candidate.status) === "Hold"
                                ? statusStyles["Hold"]
                                : "bg-yellow-300 text-gray-700 hover:text-white hover:bg-yellow-700 text-xs w-20"
                            }`}
                          >
                            <span className="flex items-center">
                              {iconMap["Hold"]}
                            </span>

                            <span className="whitespace-nowrap">
                              {(candidateStatusMap[candidate.id] ||
                                candidate.status) === "Hold"
                                ? "On Hold"
                                : "Hold"}
                            </span>
                          </button>
                        </div>
                      </div>
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
                </div>
              );
            })}
          </div>
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
