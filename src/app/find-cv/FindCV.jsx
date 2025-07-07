"use client";

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
  BULK_UPDATE_CANDIDATE_STATUS,
  UPDATE_CANDIDATE_STATUS,
} from "@/graphql/mutations/jobApplication";
import { useSearchParams, useRouter } from "next/navigation";
import { GET_ALL_CANDIDATES } from "@/graphql/queries/candidate";
import { useMutation, useQuery } from "@apollo/client";
import { DownloadIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import SEOModal from "../modals/SEOModal";
import CandidateCard from "./CandidateInfoCard";
import FilterSidebar from "./FilterSidebar";
import { iconMap, pageLimits, status, statusStyles } from "./constant";

const FindCV = () => {
  const dispatch = useDispatch();
  const { userid, role } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({ employerId: userid, skills: [] });
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidateStatusMap, setCandidateStatusMap] = useState({});
  const [loadingStatus, setLoadingStatus] = useState({});
  const [shownEmails, setShownEmails] = useState(new Set());
  const [shownPhones, setShownPhones] = useState(new Set());
  const [shownWhatsApps, setShownWhatsApps] = useState(new Set());
  const [allowedToVisit, setAllowedToVisit] = useState(new Set());
  const [downloading, setDownloading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limitPerPage = parseInt(searchParams.get("limit")) || 50;

  const skillNames = useMemo(() => {
    return (filters.skills || [])
      .map((s) => s.name)
      .filter((name) => typeof name === "string");
  }, [filters.skills]);

  const [bulkUpdateCandidateStatus] = useMutation(BULK_UPDATE_CANDIDATE_STATUS);
  const [updateStatusMutation] = useMutation(UPDATE_CANDIDATE_STATUS);

  const { data, loading, refetch } = useQuery(GET_ALL_CANDIDATES, {
    variables: {
      ...filters,
      skills: skillNames,
      page: currentPage,
      limit: limitPerPage,
    },
    fetchPolicy: "network-only",
  });

  const revealedStatuses = new Set([
    "Viewed",
    "Shortlisted",
    "Rejected",
    "Hold",
  ]);

  useEffect(() => {
    if (!data?.getAllCandidates?.candidates) return;

    const emails = new Set();
    const phones = new Set();
    const whatsApps = new Set();

    data.getAllCandidates.candidates.forEach((candidate) => {
      if (revealedStatuses.has(candidate.recruiterStatus)) {
        emails.add(candidate.id);
        phones.add(candidate.id);
        whatsApps.add(candidate.id);
      }
    });

    setShownEmails(emails);
    setShownPhones(phones);
    setShownWhatsApps(whatsApps);
    setAllowedToVisit(emails);
  }, [data]);

  useEffect(() => {
    const statusValue = selectedStatus === "All" ? "" : selectedStatus;
    handleFilterChange({ status: statusValue });
  }, [selectedStatus]);

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
        variables: { candidateId, recruiterId: userid, status: action },
      });

      const result = data?.updateCandidateStatus;

      if (!result?.success) {
        toast.error(result?.message || "Failed to perform action.");
        return;
      }

      toast.success(result.message);
      setAllowedToVisit((prev) => new Set(prev).add(candidateId));

      if (action === "email") showEmail(candidateId);
      else if (action === "phone") showPhone(candidateId);
      else if (action === "whatsapp") {
        showWhatsApp(candidateId);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=Hello%20I%20saw%20your%20profile%20on%20see%20job!`;
        window.open(whatsappUrl, "_blank");
      }
    } catch {
      toast.error("Something went wrong");
    }
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
          limit: limitPerPage,
          fetchPolicy: "network-only",
        });

        window.open(`/find-cv/${candidateId}`, "_blank");
      } else throw new Error(data?.updateCandidateStatus?.message);
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

  const showEmail = (id) => setShownEmails((prev) => new Set(prev).add(id));
  const showPhone = (id) => setShownPhones((prev) => new Set(prev).add(id));
  const showWhatsApp = (id) =>
    setShownWhatsApps((prev) => new Set(prev).add(id));

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/find-cv?${params.toString()}`);
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const downloadCandidateInfo = async () => {
    const selectedCount = selectedCandidates.length;

    if (role !== "admin" && selectedCount > allowedResume) {
      toast.error(`You can only view/download up to ${allowedResume} resumes.`);
      return;
    }

    setDownloading(true);

    try {
      const candidates = paginatedCandidates
        .filter((c) => role === "admin" || selectedCandidates.includes(c.id))
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
          Status: "Viewed",
        }));

      const worksheet = XLSX.utils.json_to_sheet(candidates);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
      XLSX.writeFile(workbook, "Candidate_List.xlsx");

      if (role !== "admin") {
        await bulkUpdateCandidateStatus({
          variables: {
            candidateIds: selectedCandidates,
            status: "Viewed",
            recruiterId: userid,
          },
        });

        await refetch({
          ...filters,
          skills: skillNames,
          page: currentPage,
          limit: limitPerPage,
          fetchPolicy: "network-only",
        });
      }
    } catch (error) {
      toast.error("Something went wrong while processing download.");
    } finally {
      setDownloading(false);
    }
  };

  const counts = useMemo(
    () => ({
      All: data?.getAllCandidates?.totalCandidates || 0,
      Viewed: data?.getAllCandidates?.viewedCount || 0,
      Shortlisted: data?.getAllCandidates?.shortlistedCount || 0,
      Rejected: data?.getAllCandidates?.rejectedCount || 0,
      Hold: data?.getAllCandidates?.holdCount || 0,
    }),
    [data]
  );

  const paginatedCandidates = data?.getAllCandidates?.candidates || [];
  const totalPages = data?.getAllCandidates?.totalPages || 1;
  const allowedResume = data?.getAllCandidates?.allowedResume ?? 0;

  if (!(role === "employer" || role === "recruiter" || role === "admin")) {
    return (
      <div className="flex items-center justify-center w-full p-2">
        <AccessDenied title1={"employer"} title2={"recruiter"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex w-64 bg-white shadow-lg border-r">
        <SEOModal slug="find-cv" />
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <div className="flex-1 w-full p-5 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {status.map((label, idx) => {
            const isActive = selectedStatus === label;
            const activeColor = statusStyles[label];
            const count = counts[label] ?? 0;

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedStatus(label);
                  setSelectedCandidates([]);
                  setCurrentPage(1);
                }}
                className={`${
                  isActive ? activeColor : "bg-gray-400 text-gray-600"
                } p-2 rounded-md hover:${activeColor} flex items-center gap-2 font-normal transition-colors duration-300`}
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

          <div className="w-20">
            <Select
              value={String(limitPerPage)}
              onValueChange={(val) => {
                const newLimit = Number(val);
                const params = new URLSearchParams(searchParams.toString());
                params.set("limit", newLimit.toString());
                params.set("page", "1"); // Reset to first page
                router.push(`/find-cv?${params.toString()}`);
                setLimitPerPage(Number(val));
                setSelectedCandidates([]);
                setCurrentPage(1);
              }}
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

        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSelectedCandidates(paginatedCandidates.map((c) => c.id))
              }
              className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded-md"
            >
              Select All
            </button>

            {selectedCandidates.length > 0 && (
              <>
                <button
                  onClick={() => setSelectedCandidates([])}
                  className="bg-red-500 text-white hover:bg-red-600 p-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={downloadCandidateInfo}
                  disabled={downloading}
                  className={`bg-emerald-500 text-white p-2 rounded-md flex items-center gap-2 transition-colors duration-300 ${
                    downloading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-emerald-600"
                  }`}
                >
                  {downloading ? (
                    <>
                      <span className="loader small"></span> Please wait...
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="w-4 h-4" />
                      Download Details
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          <div className="flex text-xs">Downloads Left : {allowedResume}</div>
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
                <CandidateCard
                  candidate={candidate}
                  key={candidate.id}
                  selectedCandidates={selectedCandidates}
                  shownEmails={shownEmails}
                  shownPhones={shownPhones}
                  shownWhatsApps={shownWhatsApps}
                  candidateStatusMap={candidateStatusMap}
                  loadingStatus={loadingStatus}
                  allowedToVisit={allowedToVisit}
                  toggleCandidateSelection={toggleCandidateSelection}
                  fireCandidateAction={fireCandidateAction}
                  checkAccess={checkAccess}
                  updateCandidateStatus={updateCandidateStatus}
                  currentStatus={currentStatus}
                />
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
