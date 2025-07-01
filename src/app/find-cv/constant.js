import { Eye, UserCheck, UserPlus, UserX } from "lucide-react";
import moment from "moment";

export const status = ["All", "Viewed", "Shortlisted", "Rejected", "Hold"];

export const pageLimits = [50, 100, 150, 200, 250];

export const statusStyles = {
  All: "bg-gray-600 text-white hover:bg-gray-700 font-semibold",
  Viewed: "bg-blue-600 text-white hover:bg-blue-700 font-semibold",
  Shortlisted: "bg-green-600 text-white hover:bg-green-700 font-semibold",
  Rejected: "bg-red-600 text-white hover:bg-red-700 font-semibold",
  Hold: "bg-yellow-500 text-white hover:bg-yellow-600 font-semibold",
};

export const iconMap = {
  Shortlisted: <UserPlus className="w-4 h-4" />,
  Rejected: <UserX className="w-4 h-4" />,
  Hold: <UserCheck className="w-4 h-4" />,
  Viewed: <Eye className="w-4 h-4" />,
};

export const getTimeAgo = (timestamp) => {
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

export const jobType = [
  "Full Time",
  "Freelance",
  "Internship",
  "Work From Home",
  "On Site",
  "Hybrid",
];

export const salaryOptions = [
  { value: 0, label: "10,000" },
  { value: 1, label: "20,000" },
  { value: 2, label: "30,000" },
  { value: 3, label: "40,000" },
  { value: 4, label: "50,000" },
  { value: 5, label: "60,000" },
  { value: 6, label: "70,000" },
  { value: 7, label: "80,000" },
  { value: 8, label: "90,000" },
  { value: 9, label: "100,000" },
  { value: 10, label: "120,000" },
  { value: 11, label: "150,000" },
];
