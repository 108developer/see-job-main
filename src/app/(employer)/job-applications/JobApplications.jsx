"use client";

import FilterSidebar from "@/app/find-cv/FilterSidebar";
import SEOModal from "@/app/modals/SEOModal";
import { Pagination } from "@/components/Pagination";
import AccessDenied from "@/components/ui/AccessDenied ";
import { Loader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UPDATE_APPLICATION_STATUS,
  BULK_UPDATE_JOB_APPLICATION_STATUS,
} from "@/graphql/mutations/jobApplication";
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
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const status = ["All", "Viewed", "Shortlisted", "Rejected", "Hold"];

const pageLimits = [50, 100, 150, 200, 250];

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
  const dispatch = useDispatch();
  const jobId = searchParams.get("jobId");
  const { userid, token, role } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({ jobId, skills: [] });
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loadingStatus, setLoadingStatus] = useState({});
  const [candidateStatusMap, setCandidateStatusMap] = useState({});
  const [expandedCandidateId, setExpandedCandidateId] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const [shownEmails, setShownEmails] = useState(new Set());
  const [shownPhones, setShownPhones] = useState(new Set());
  const [shownWhatsApps, setShownWhatsApps] = useState(new Set());
  const [allowedToVisit, setAllowedToVisit] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(50);

  const skillNames = useMemo(() => {
    return (filters.skills || [])
      .map((s) => s.name)
      .filter((name) => typeof name === "string");
  }, [filters.skills]);

  const [bulkUpdateStatusMutation] = useMutation(
    BULK_UPDATE_JOB_APPLICATION_STATUS
  );

  const { data, loading, refetch } = useQuery(GET_JOB_APPLICATIONS, {
    variables: {
      ...filters,
      skills: skillNames,
      recruiterId: userid,
      page: currentPage,
      limit: limitPerPage,
    },
    fetchPolicy: "network-only",
  });

  const [updateStatusMutation] = useMutation(UPDATE_APPLICATION_STATUS);

  useEffect(() => {
    const statusValue = selectedStatus === "All" ? "" : selectedStatus;
    handleFilterChange({ status: statusValue });
  }, [selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const jobApplications = data?.getJobApplications?.jobApplications || [];
    if (jobApplications.length === 0) return;

    const emails = new Set();
    const phones = new Set();
    const whatsApps = new Set();

    jobApplications.forEach((candidate) => {
      const status = candidate.status?.toLowerCase();
      if (["viewed", "shortlisted", "hold", "rejected"].includes(status)) {
        emails.add(candidate.id);
        phones.add(candidate.id);
        whatsApps.add(candidate.id);
      }
    });

    setShownEmails(emails);
    setShownPhones(phones);
    setShownWhatsApps(whatsApps);
    setAllowedToVisit(emails); // or merge sets if needed
  }, [data]);

  const checkAccess = (candidateId) => {
    return (
      shownEmails.has(candidateId) ||
      shownPhones.has(candidateId) ||
      shownWhatsApps.has(candidateId)
    );
  };

  const fireCandidateAction = async (candidateId, action, phone) => {
    try {
      const { data } = await updateStatusMutation({
        variables: {
          applicationId: candidateId,
          recruiterId: userid,
          status: action,
        },
      });

      const result = data?.updateJobApplicationStatus;

      if (!result?.success) {
        toast.error(result?.message || "Failed to perform action.");
        return;
      }

      toast.success(result.message);
      setAllowedToVisit((prev) => new Set(prev).add(candidateId));

      if (action === "email") {
        showEmail(candidateId);
      } else if (action === "phone") {
        showPhone(candidateId);
      } else if (action === "whatsapp") {
        showWhatsApp(candidateId);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=Hello%20I%20saw%20your%20profile%20on%20see%20job!`;
        window.open(whatsappUrl, "_blank");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setShownEmails((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    setAllowedToVisit((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const showPhone = (id) => {
    setShownPhones((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    setAllowedToVisit((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const showWhatsApp = (id) => {
    setShownWhatsApps((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    setAllowedToVisit((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

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

        await refetch({
          ...filters,
          skills: skillNames,
          recruiterId: userid,
          page: currentPage,
          limit: limitPerPage,
          fetchPolicy: "network-only",
        });
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

  const downloadCandidateInfo = async () => {
    const selectedApps = jobApplications.filter((c) =>
      selectedCandidates.includes(c.id)
    );
    const applicationIds = selectedApps.map((c) => c.id);

    // Bulk update status to "Viewed" or any appropriate status
    try {
      const { data } = await bulkUpdateStatusMutation({
        variables: {
          applicationIds,
          status: "Viewed",
          recruiterId: userid,
        },
      });

      if (data.bulkUpdateJobApplicationStatus.success) {
        toast.success(data.bulkUpdateJobApplicationStatus.message);

        const candidates = selectedApps.map((c) => ({
          ID: c.id,
          Name: c.fullName || c.name,
          Gender: c.gender,
          Email: c.email,
          Phone: c.phone || "N/A",
          Location: c.location,
          "Preferred JobLocation": c.preferredJobLocation,
          "Date of Birth": c.dob,
          "Permanent Address": c.permanentAddress,
          "Experience Years": c.experienceYears,
          "Highest Qualification": c.highestQualification,
          Skills: c.skills?.join(", ") || "N/A",
          Status: candidateStatusMap[c.id] || "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(candidates);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
        XLSX.writeFile(workbook, "Candidate_List.xlsx");

        window.location.reload();
      } else {
        toast.error(data.bulkUpdateJobApplicationStatus.message);
      }
    } catch (error) {
      toast.error("Failed to update status and download candidates.");
    }
  };

  const counts = {
    Viewed: data?.getJobApplications?.viewedCount || 0,
    Shortlisted: data?.getJobApplications?.shortlistedCount || 0,
    Rejected: data?.getJobApplications?.rejectedCount || 0,
    Hold: data?.getJobApplications?.holdCount || 0,
  };

  const jobApplications = data?.getJobApplications?.jobApplications || [];
  const totalPages = data?.getJobApplications?.totalPages || 1;

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
  //       <Loader count={5} height={50} className="mb-4" />
  //     </div>
  //   );
  // }

  if (!(role === "employer" || role === "recruiter")) {
    return (
      <div className="flex items-center justify-center w-full p-2">
        <AccessDenied title1={"employer"} title2={"recruiter"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <SEOModal slug="job-applications" />

      {/* Sidebar */}
      <div className="flex w-64 bg-white shadow-lg border-r">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full p-5 bg-gray-50">
        <div className="flex flex-col gap-4 mb-6">
          {/* Top Line: Status buttons + per-page dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            {status.map((label, idx) => {
              const isActive = selectedStatus === label;
              const activeColor = statusStyles[label];
              const count = label !== "All" ? counts[label] ?? 0 : null;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedStatus(label)}
                  className={`${
                    isActive ? activeColor : "bg-gray-400 text-gray-600"
                  } px-4 py-2 rounded-md font-semibold hover:${activeColor} flex items-center gap-2 transition-colors duration-300`}
                >
                  {iconMap[label]} {label}
                  {count !== null && (
                    <span className="ml-1 text-sm bg-white text-gray-700 rounded-full px-2">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Per Page Dropdown */}
            <div className="w-20">
              <Select
                value={String(limitPerPage)}
                onValueChange={(val) => setLimitPerPage(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  {pageLimits.map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bottom Line: Trio aligned right */}
          <div className="w-full flex justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const allIds = jobApplications.map(
                    (candidate) => candidate.id
                  );
                  setSelectedCandidates(allIds);
                }}
                className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors duration-300"
              >
                Select All
              </button>

              {selectedCandidates && selectedCandidates.length > 0 && (
                <>
                  <button
                    onClick={() => setSelectedCandidates([])}
                    className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors duration-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={downloadCandidateInfo}
                    className="bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors duration-300"
                  >
                    Download Details
                  </button>
                </>
              )}
            </div>
          </div>
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
                <div
                  key={candidate.id}
                  className="flex flex-col md:flex-row gap-2"
                >
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
                    <div className="flex flex-col md:flex-row justify-between w-full gap-2">
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
                          {candidate?.currentSalary?.toLocaleString() ||
                            "Not Available"}
                          /month
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <Banknote className="w-4 h-4" />
                          Expected Salary : ₹{" "}
                          {candidate?.expectedSalary?.toLocaleString() ||
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
                      <div className="p-2 text-center text-sm bg-gray-100/80 gap-4 flex flex-col md:w-72">
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
                            {/* <Link
                              href={{
                                pathname: `/find-cv/${candidate.candidateId}`,
                                query: {
                                  jobId,
                                },
                              }}
                            > */}
                            <button
                              onClick={() =>
                                window.open(
                                  `/find-cv/${candidate.candidateId}?jobId=${jobId}`,
                                  "_blank"
                                )
                              }
                            >
                              <div className="text-xl font-semibold text-red-600 gap-2 flex flex-wrap ">
                                {candidate.fullName || "Not Available"}
                              </div>
                            </button>
                            {/* </Link> */}
                            <div className="text-sm text-gray-500 flex">
                              Age: {candidate.age || "Not Available"} /{" "}
                              {candidate.gender || "Not Available"}
                            </div>
                            <div className="text-sm text-gray-600 flex">
                              {candidate.mode || "Not Available"}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
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
                              className="bg-blue-600 text-white font-semibold flex items-center gap-2 px-2 py-1 rounded-lg md:ml-auto"
                            >
                              <DownloadIcon className="w-4 h-4" />
                              Resume
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center gap-2 text-sm">
                          <button
                            onClick={() =>
                              fireCandidateAction(candidate.id, "email")
                            }
                            className="flex items-center text-xs gap-2 bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300"
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

                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm w-full">
                            {/* Phone Button */}
                            <button
                              onClick={() =>
                                fireCandidateAction(candidate.id, "phone")
                              }
                              className="flex items-center text-xs font-semibold gap-2 bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700"
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
                              onClick={() => {
                                fireCandidateAction(
                                  candidate.id,
                                  "whatsapp",
                                  candidate.phone
                                );
                              }}
                              className="flex items-center text-xs font-semibold gap-2 bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700"
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
                                candidate.recruiterStatus) !== "Viewed"
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

                        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2">
                          <button
                            onClick={() => {
                              if (!checkAccess(candidate.id)) {
                                toast.warn(
                                  "Please reveal contact info to take this action."
                                );
                                return;
                              }
                              updateCandidateStatus(
                                candidate.id,
                                "Shortlisted"
                              );
                            }}
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
                            onClick={() => {
                              if (!checkAccess(candidate.id)) {
                                toast.warn(
                                  "Please reveal contact info to take this action."
                                );
                                return;
                              }
                              updateCandidateStatus(candidate.id, "Rejected");
                            }}
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
                            onClick={() => {
                              if (!checkAccess(candidate.id)) {
                                toast.warn(
                                  "Please reveal contact info to take this action."
                                );
                                return;
                              }
                              updateCandidateStatus(candidate.id, "Hold");
                            }}
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
