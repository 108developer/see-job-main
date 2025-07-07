"use client";

import ZoomImage from "@/components/ux/ZoomImage";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";
import BoyPlaceholderImage from "@/images/boy_default_img.jpg";
import GirlPlaceholderImage from "@/images/girl_default_img.jpg";
import { handleDownloadResume } from "@/utils/HandleDownloadResume";
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
} from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import { getTimeAgo, iconMap, statusStyles } from "./constant";

const CandidateInfoCard = React.memo(
  ({
    candidate,
    selectedCandidates,
    shownEmails,
    shownPhones,
    shownWhatsApps,
    candidateStatusMap,
    loadingStatus,
    allowedToVisit,
    toggleCandidateSelection,
    fireCandidateAction,
    checkAccess,
    updateCandidateStatus,
    currentStatus,
  }) => {
    return (
      <div key={candidate.id} className="flex flex-col md:flex-row gap-2">
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
                Experience : {candidate.experience || "Not Available"} years
              </div>
              {/* </div> */}

              {/* <div className="flex items-center gap-2"> */}
              <div className="flex items-center gap-2 w-full">
                <IndianRupee className="w-4 h-4" />
                Current Salary : ₹{" "}
                {candidate?.currentSalary?.toLocaleString() || "Not Available"}
                /month
              </div>
              <div className="flex items-center gap-2 w-full">
                <Banknote className="w-4 h-4" />
                Expected Salary : ₹{" "}
                {candidate?.expectedSalary?.toLocaleString() || "Not Available"}
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
                <div className="text-red-600 font-semibold">Skills</div>

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
                  <ZoomImage
                    src={
                      candidate.profilePic
                        ? candidate.profilePic
                        : candidate.gender === "Male"
                        ? BoyPlaceholderImage
                        : candidate.gender === "Female"
                        ? GirlPlaceholderImage
                        : PlaceholderImage
                    }
                    alt={candidate.fullName || "Candidate Profile Picture"}
                    width={100}
                    height={100}
                  />

                  {/* <ProfileImage src="/profile.jpg" alt="Profile Picture" /> */}
                </div>

                <div className="w-full flex flex-col p-1 ">
                  <div
                    className="text-xl font-semibold text-red-600 gap-2 flex flex-wrap cursor-pointer hover:underline"
                    onClick={(e) => {
                      const currentStatus =
                        candidateStatusMap[candidate.id] ||
                        candidate.recruiterStatus ||
                        "All";

                      if (!checkAccess(candidate.id, "view this candidate"))
                        return;

                      if (currentStatus !== "Viewed") {
                        updateCandidateStatus(candidate.id, "Viewed");
                      }

                      window.open(`/find-cv/${candidate.id}`, "_blank");
                    }}
                  >
                    {candidate?.name || "Not Available"}
                  </div>

                  <div className="flex gap-2">
                    <div className="text-sm text-gray-500 flex">
                      Age: {candidate?.age || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500 flex">/</div>
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
                    Shortlisted by {candidate?.shortlistedBy || "0"} Recruiters
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
                  onClick={() => fireCandidateAction(candidate.id, "email")}
                  className="flex items-center text-xs gap-2 bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300"
                >
                  <Mail className="w-4 h-4" />
                  {shownEmails.has(candidate?.id) ? candidate.email : "EMAIL"}
                  {shownEmails.has(candidate?.id) ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm w-full">
                  {/* Phone Button */}
                  <button
                    onClick={() => fireCandidateAction(candidate.id, "phone")}
                    className="flex items-center text-xs font-semibold gap-2 bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700"
                  >
                    <Phone className="w-4 h-4" />
                    {shownPhones.has(candidate.id) ? candidate.phone : "PHONE"}
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
                    className="flex items-center text-xs font-semibold gap-2 bg-emerald-600 text-white p-2 rounded-md hover:bg-emerald-700 scale-75 hover:scale-105 transform transition duration-300 ease-in-out"
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

              {/* <button
                          onClick={() =>
                            router.push(`/find-cv/${candidate.id}`)
                          }
                        > */}
              <div
                onClick={(e) => {
                  if (!allowedToVisit.has(candidate.id)) {
                    e.preventDefault();
                    toast.warn("Please reveal contact info to view details.");
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
                  onClick={() => {
                    if (!checkAccess(candidate.id)) {
                      toast.warn(
                        "Please reveal contact info to take this action."
                      );
                      return;
                    }
                    updateCandidateStatus(candidate.id, "Shortlisted");
                  }}
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
                    currentStatus === "Rejected" || loadingStatus[candidate.id]
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
                    currentStatus === "Hold" || loadingStatus[candidate.id]
                  }
                  className={`flex items-center gap-1 p-2 rounded-md ${
                    (candidateStatusMap[candidate.id] ||
                      candidate.recruiterStatus) === "Hold"
                      ? statusStyles["Hold"]
                      : "bg-yellow-300 text-gray-700 hover:text-white hover:bg-yellow-700 text-xs w-20"
                  }`}
                >
                  <span className="flex items-center">{iconMap["Hold"]}</span>

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
  }
);

export default CandidateInfoCard;
