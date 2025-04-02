"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobPostingImage from "@/images/jobs-large.jpg";
import Image from "next/image";
import { useState } from "react";

const jobOptions = [
  { value: "1", label: "1 Job" },
  { value: "2", label: "2 Jobs" },
  { value: "3", label: "3 Jobs" },
  { value: "4", label: "4 Jobs" },
];

const validityOptions = [
  { value: "30d", label: "30 Days" },
  { value: "60d", label: "60 Days" },
  { value: "90d", label: "90 Days" },
  { value: "120d", label: "120 Days" },
];

const JobPosting = () => {
  const [selectedJobs, setSelectedJobs] = useState("1");
  const [selectedValidity, setSelectedValidity] = useState("30d");
  const [price, setPrice] = useState(600);

  const calculatePrice = (numJobs) => {
    let basePrice = 600;
    let totalPrice = basePrice * numJobs;
    if (numJobs > 1) {
      totalPrice -= 50;
    }
    return totalPrice;
  };

  const handleJobChange = (value) => {
    const numJobs = parseInt(value, 10);
    setSelectedJobs(value);
    setPrice(calculatePrice(numJobs));
  };

  const handleValidityChange = (value) => {
    setSelectedValidity(value);
  };

  return (
    <div className="mx-auto p-8 flex gap-8 bg-white">
      <div className="hidden md:flex w-1/4 h-1/2">
        <Image src={JobPostingImage} alt="We are hiring" />
      </div>
      <div className="flex flex-col w-full border shadow-md p-4 gap-4 items-center">
        <div className="flex w-full gap-4 items-center">
          <div className="flex w-full flex-col">
            <label className="font-semibold text-gray-700 mb-2">
              Number of Jobs
            </label>
            <Select value={selectedJobs} onValueChange={handleJobChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select No of Jobs" />
              </SelectTrigger>
              <SelectContent>
                {jobOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full flex-col">
            <label className="font-semibold text-gray-700 mb-2">Validity</label>
            <Select
              className="ml-4"
              value={selectedValidity}
              onValueChange={handleValidityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Validity" />
              </SelectTrigger>
              <SelectContent>
                {validityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-4 w-full">
            <label className="font-semibold text-gray-700 mb-2">Price</label>
            <p className="font-semibold">Rs {price} /-</p>
          </div>
          <div className="ml-4 w-full">
            <label className="font-semibold text-gray-700 mb-2">{""}</label>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md">
              Buy Now
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full text-gray-700">
          <div className="text-red-600 my-4 text-lg font-semibold">
            Description
          </div>
          <p>For 1 job positng for 1 month is Rs 600</p>
          <p>
            IF job posting is increase so *2 and reduce 50 from the total amount
            eg:_ 2 job posting is rs 1200 si the cost would be Rs1150
          </p>
          <p>Hire Candidated According to Your needs.</p>
          <p>Easy To manage Your Job Hiring.</p>
          <p>Pocket-Friendly price.</p>
        </div>
      </div>
    </div>
  );
};

export default JobPosting;
