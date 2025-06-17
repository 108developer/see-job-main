"use client";

import { Pagination } from "@/components/Pagination";
import AccessDenied from "@/components/ui/AccessDenied ";
import { Loader } from "@/components/ui/loader";
import { UPDATE_CANDIDATE_STATUS } from "@/graphql/mutations/jobApplication";
import { GET_ALL_CANDIDATES } from "@/graphql/queries/candidate";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";
import BoyPlaceholderImage from "@/images/boy_default_img.jpg";
import GirlPlaceholderImage from "@/images/girl_default_img.jpg";
import { setModal } from "@/redux/slices/modalSlice";
import { handleDownloadResume } from "@/utils/HandleDownloadResume";
import { useMutation, useQuery } from "@apollo/client";
import {
  Banknote,
  Briefcase,
  Calendar,
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
import moment from "moment";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import SEOModal from "../modals/SEOModal";
import FilterSidebar from "./FilterSidebar";

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

const getTimeAgo = (timestamp) => {
  const now = moment();
  const updated = moment(Number(timestamp));
  const years = now.diff(updated, "years");
  const months = now.diff(updated, "months") % 12;
  const weeks = now.diff(updated, "weeks");
  const days = now.diff(updated, "days");

  if (years > 0) {
    if (months > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${months} month${
        months > 1 ? "s" : ""
      } ago`;
    }
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }

  if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return "Today";
};

const FindCV = () => {
  const dispatch = useDispatch();
  const { userid, role } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({ employerId: userid, skills: [] });
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidateStatusMap, setCandidateStatusMap] = useState({});
  const [loadingStatus, setLoadingStatus] = useState({});
  const [shownEmails, setShownEmails] = useState(new Set());
  const [shownPhones, setShownPhones] = useState(new Set());
  const [shownWhatsApps, setShownWhatsApps] = useState(new Set());
  const [allowedToVisit, setAllowedToVisit] = useState(new Set());

  const skillNames = useMemo(() => {
    return (filters.skills || [])
      .map((s) => s.name)
      .filter((name) => typeof name === "string");
  }, [filters.skills]);

  const { data, loading, refetch } = useQuery(GET_ALL_CANDIDATES, {
    variables: {
      ...filters,
      skills: skillNames,
      page: currentPage,
      limit: 10,
    },
    fetchPolicy: "network-only",
  });

  const [updateStatusMutation] = useMutation(UPDATE_CANDIDATE_STATUS);

  useEffect(() => {
    const statusValue = selectedStatus === "All" ? "" : selectedStatus;
    handleFilterChange({ status: statusValue });
  }, [selectedStatus]);

  useEffect(() => setCurrentPage(1), [filters]);

  const handleFilterChange = (updatedFilters) => {
    const merged = { ...filters, ...updatedFilters };
    Object.keys(merged).forEach((key) => {
      if (
        merged[key] === null ||
        merged[key] === "" ||
        merged[key] === "null" ||
        merged[key] === "NaN" ||
        (Array.isArray(merged[key]) && merged[key].length === 0)
      ) {
        delete merged[key];
      }
    });
    setFilters({ ...merged, skills: [...(merged.skills || [])] });
  };

  const toggleCandidateSelection = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const updateCandidateStatus = async (candidateId, newStatus) => {
    const currentStatus = candidateStatusMap[candidateId] || "All";
    if (currentStatus === newStatus) return;

    setLoadingStatus((prev) => ({ ...prev, [candidateId]: true }));
    const previousStatus = currentStatus;

    try {
      setCandidateStatusMap((prev) => ({
        ...prev,
        [candidateId]: newStatus,
      }));

      const { data } = await updateStatusMutation({
        variables: { candidateId, status: newStatus, recruiterId: userid },
      });

      if (data?.updateCandidateStatus?.success) {
        toast.success(data?.updateCandidateStatus?.message);

        await refetch({
          ...filters,
          skills: skillNames,
          page: currentPage,
          limit: 10,
          fetchPolicy: "network-only",
        });

        window.open(`/find-cv/${candidateId}`, "_blank");
      } else {
        throw new Error(data?.updateCandidateStatus?.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
      setCandidateStatusMap((prev) => ({
        ...prev,
        [candidateId]: previousStatus,
      }));
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [candidateId]: false }));
    }
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

  const handlePageChange = (page) => setCurrentPage(page);

  const openSendMailsModal = () => {
    const candidates = paginatedCandidates
      .filter((c) => selectedCandidates.includes(c.id))
      .map((c) => ({ id: c.id, fullName: c.fullName, email: c.email }));

    dispatch(
      setModal({ modalType: "sendMailsModal", modalProps: { candidates } })
    );
  };

  const downloadCandidateInfo = () => {
    const candidates = paginatedCandidates
      .filter((c) => selectedCandidates.includes(c.id))
      .map((c) => ({
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
  };

  const counts = {
    All: data?.getAllCandidates?.totalCandidates || 0,
    Viewed: data?.getAllCandidates?.viewedCount || 0,
    Shortlisted: data?.getAllCandidates?.shortlistedCount || 0,
    Rejected: data?.getAllCandidates?.rejectedCount || 0,
    Hold: data?.getAllCandidates?.holdCount || 0,
  };

  const paginatedCandidates = data?.getAllCandidates?.candidates || [];
  const totalPages = data?.getAllCandidates?.totalPages || 1;

  if (!(role === "employer" || role === "recruiter" || role === "admin")) {
    return (
      <div className="flex items-center justify-center w-full p-2">
        <AccessDenied title1={"employer"} title2={"recruiter"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="flex w-64 bg-white shadow-lg border-r">
        <SEOModal slug="find-cv" />
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full p-5 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {status.map((label, idx) => {
            const isActive = selectedStatus === label;
            const activeColor = statusStyles[label];
            const count = counts[label] ?? 0;

            return (
              <button
                key={idx}
                onClick={() => setSelectedStatus(label)}
                className={`${
                  isActive ? activeColor : "bg-gray-400 text-gray-600"
                } p-2 rounded-md hover:${activeColor} flex items-center gap-2 transition-colors duration-300`}
              >
                {iconMap[label]} {label}{" "}
                {count !== null && (
                  <span className="ml-1 text-sm bg-white text-gray-700 rounded-full px-2">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          {selectedCandidates && selectedCandidates.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <div
                onClick={() => {
                  const allIds = paginatedCandidates.map(
                    (candidate) => candidate.id
                  );
                  setSelectedCandidates(allIds);
                }}
                className="ml-auto bg-blue-500 text-white hover:bg-blue-600 p-2 rounded-md flex items-center gap-2 transition-colors duration-300 cursor-pointer"
              >
                Select All
              </div>
              <div
                onClick={() => setSelectedCandidates([])}
                className="ml-auto bg-red-500 text-white hover:bg-red-600 p-2 rounded-md flex items-center gap-2 transition-colors duration-300 cursor-pointer"
              >
                Cancel
              </div>

              {/* <div
                onClick={openSendMailsModal}
                className="ml-auto bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors duration-300 cursor-pointer"
              >
                Send Mail
              </div> */}
              <div
                onClick={downloadCandidateInfo}
                className="ml-auto bg-emerald-500 text-white hover:bg-emerald-600 p-2 rounded-md flex items-center gap-2 transition-colors duration-300 cursor-pointer"
              >
                Download Details
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
            <Loader count={5} height={50} className="mb-4" />
          </div>
        ) : paginatedCandidates.length === 0 ? (
          <div className="text-center text-xl font-semibold text-gray-600">
            No candidates found for the selected filters.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {paginatedCandidates.map((candidate) => {
              const currentStatus =
                candidateStatusMap[candidate.id] || candidate.recruiterStatus;

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
                    className="flex flex-col-reverse gap-2  bg-white border rounded-lg shadow-md px-8 py-4 w-full mx-auto hover:shadow-lg transition-all"
                  >
                    {/* Candidate Details */}
                    <div className="flex flex-col md:flex-row md:justify-between w-full gap-2">
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
                              src={
                                candidate.profilePic
                                  ? candidate.profilePic
                                  : candidate.gender === "Male"
                                  ? BoyPlaceholderImage
                                  : candidate.gender === "Female"
                                  ? GirlPlaceholderImage
                                  : PlaceholderImage
                              }
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
                            <div
                              className="text-xl font-semibold text-red-600 gap-2 flex flex-wrap "
                              onClick={() =>
                                window.open(
                                  `/find-cv/${candidate.id}`,
                                  "_blank"
                                )
                              }
                            >
                              {candidate?.name || "Not Available"}
                            </div>

                            <div className="flex gap-2">
                              <div className="text-sm text-gray-500 flex">
                                Age: {candidate?.age || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500 flex">
                                /
                              </div>
                              <div className="text-sm text-gray-500 flex">
                                {candidate?.gender || "Not Available"}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 flex">
                              {candidate?.mode}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="">
                            <div className="flex text-xs">
                              Shortlisted by {candidate?.shortlistedBy || "0"}{" "}
                              Recruiters
                            </div>
                            <div className="text-xs flex text-gray-500">
                              Last Activity:{" "}
                              {candidate?.updatedAt
                                ? getTimeAgo(candidate.updatedAt)
                                : "Not Available"}
                            </div>
                          </div>

                          <div className="">
                            <button
                              onClick={() =>
                                handleDownloadResume(
                                  candidate?.resume,
                                  candidate?.name,
                                  candidate?.email
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
                            onClick={() => {
                              showEmail(candidate?.id);
                            }}
                            className="flex items-center text-xs gap-2 bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300"
                          >
                            <Mail className="w-4 h-4" />
                            {shownEmails.has(candidate?.id)
                              ? candidate.email
                              : "EMAIL"}
                            {shownEmails.has(candidate?.id) ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>

                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm w-full">
                            {/* Phone Button */}
                            <button
                              onClick={() => {
                                showPhone(candidate.id);
                              }}
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
                            <a
                              className="scale-75 hover:scale-105 transform transition duration-300 ease-in-out"
                              href={`https://api.whatsapp.com/send?phone=${candidate.phone}&text=Hello%20I%20saw%20your%20profile%20on%20see%20job!`}
                              target="_blank"
                            >
                              <button
                                onClick={() => showWhatsApp(candidate.id)}
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
                            </a>
                          </div>
                        </div>

                        {/* <button
                          onClick={() =>
                            router.push(`/find-cv/${candidate.id}`)
                          }
                        > */}
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
                              candidate.recruiterStatus) === "Viewed"
                              ? statusStyles["Viewed"]
                              : "bg-gray-400 text-gray-700 hover:text-white hover:bg-blue-600"
                          }`}
                        >
                          {iconMap["Viewed"]}
                          {(candidateStatusMap[candidate.id] ||
                            candidate.recruiterStatus) === "Viewed"
                            ? "Viewed"
                            : "View Details"}
                        </div>
                        {/* </button> */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2">
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
                                candidate.recruiterStatus) === "Shortlisted"
                                ? statusStyles["Shortlisted"]
                                : "bg-green-300 text-gray-700 hover:text-white hover:bg-green-600 text-xs w-24"
                            }`}
                          >
                            {iconMap["Shortlisted"]}
                            {(candidateStatusMap[candidate.id] ||
                              candidate.recruiterStatus) === "Shortlisted"
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
                                candidate.recruiterStatus) === "Rejected"
                                ? statusStyles["Rejected"]
                                : "bg-red-300 text-gray-700 hover:text-white hover:bg-red-600 text-xs w-20"
                            }`}
                          >
                            {iconMap["Rejected"]}
                            {(candidateStatusMap[candidate.id] ||
                              candidate.recruiterStatus) === "Rejected"
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
                                candidate.recruiterStatus) === "Hold"
                                ? statusStyles["Hold"]
                                : "bg-yellow-300 text-gray-700 hover:text-white hover:bg-yellow-700 text-xs w-20"
                            }`}
                          >
                            <span className="flex items-center">
                              {iconMap["Hold"]}
                            </span>

                            <span className="whitespace-nowrap">
                              {(candidateStatusMap[candidate.id] ||
                                candidate.recruiterStatus) === "Hold"
                                ? "On Hold"
                                : "Hold"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
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

export default FindCV;
