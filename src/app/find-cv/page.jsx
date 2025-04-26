"use client";

import { Pagination } from "@/components/Pagination";
import { GET_ALL_CANDIDATES } from "@/graphql/queries/candidate";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";
import { useQuery } from "@apollo/client";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import {
  Award,
  Banknote,
  Briefcase,
  Calendar,
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
import FilterSidebar from "./FilterSidebar";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    salaryMin: 0,
    salaryMax: 5000000,
    experienceMin: 0,
    experienceMax: 15,
    skills: [],
    ageMin: 18,
    ageMax: 60,
  });

  const router = useRouter();

  const { data, error, loading } = useQuery(GET_ALL_CANDIDATES, {
    variables: {
      ...filters,
      page: currentPage,
    },
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

  const paginatedCandidates = data?.getAllCandidates?.candidates || [];
  const totalPages = data?.getAllCandidates?.totalPages || 1;

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
        ) : paginatedCandidates.length === 0 ? (
          <div className="text-center text-xl font-semibold text-gray-600">
            No candidates found for the selected filters.
          </div>
        ) : (
          paginatedCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white border rounded-lg shadow-md p-4 mt-4 w-full mx-auto hover:shadow-lg transition-all"
            >
              {/* Candidate Information Header */}
              <div className="flex items-center space-x-8">
                <Image
                  src={candidate.profilePic || PlaceholderImage}
                  alt={candidate.name || "Candidate Profile Picture"}
                  width={100}
                  height={100}
                  className="object-cover"
                />
                <div onClick={() => router.push(`/find-cv/${candidate.id}`)}>
                  <h4 className="text-xl font-semibold text-red-600 gap-2 flex items-center">
                    {candidate.name || "Not Available"}
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

              {/* Candidate Details */}
              <div className="flex flex-col md:flex-row w-full items-center justify-between ">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4" />
                      Course: {candidate.course || "Not Available"}
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4" />
                      Education: {candidate.degree || "Not Available"}
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <UserCheck className="w-4 h-4" />
                      Designation: {candidate.jobTitle || "Not Available"}
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4" />
                      Board: {candidate.board || "Not Available"}
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      Exp: {candidate.experience || "Not Available"} years
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <IndianRupee className="w-4 h-4" />
                      Current Salary: ₹{" "}
                      {candidate?.currentSalary.toLocaleString() ||
                        "Not Available"}
                      /month
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Banknote className="w-4 h-4" />
                      Expected Salary: ₹
                      {candidate?.expectedSalary.toLocaleString() ||
                        "Not Available"}
                      /month
                    </li>

                    <li className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      Location: {candidate.location || "Not Available"}
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4" />
                      Medium: {candidate.medium || "Not Available"}
                    </li>
                  </ul>
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
                    <button className="flex items-center text-sm gap-2 bg-green-600 text-white py-1 px-2 rounded-md hover:bg-green-700">
                      <Mail className="w-4 h-4" />
                      MAIL
                    </button>
                    <button className="flex items-center text-sm gap-2 bg-gray-200 text-gray-700 py-1 px-2 rounded-md hover:bg-gray-300">
                      <Phone className="w-4 h-4" />
                      CALL
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
              <div className="bg-gray-100 p-4 mt-4 rounded-md">
                <div className="flex justify-between items-center">
                  <a href="#" className="text-red-600 font-semibold">
                    <strong>Remarks</strong>
                  </a>
                  <a
                    href="#"
                    className="text-green-600 font-semibold flex items-center gap-2 "
                  >
                    <ChatBubbleIcon className="w-4 h-4" />
                    Whatsapp
                  </a>
                </div>
                <p className="mt-2">
                  <strong>Key Skills:</strong>{" "}
                  {candidate.skills && candidate.skills.length > 0
                    ? `${candidate.skills.join(", ")}`
                    : "Not Available"}
                </p>
              </div>
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

export default Page;
