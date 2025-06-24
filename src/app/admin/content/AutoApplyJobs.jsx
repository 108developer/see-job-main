import { useAutoApplyToJobsMutation } from "@/redux/api/jobApi"; // Adjust path as needed
import { useState } from "react";
import { toast } from "react-toastify";

const AutoApplyJobs = () => {
  const [numberOfCandidates, setNumberOfCandidates] = useState(5);
  const [isApplying, setIsApplying] = useState(false);

  const [autoApplyToJobs] = useAutoApplyToJobsMutation();

  const handleAutoApply = async () => {
    if (numberOfCandidates <= 0) {
      toast.error("Number of Job Applications must be greater than 0");
      return;
    }

    setIsApplying(true);

    try {
      const response = await autoApplyToJobs({ numberOfCandidates }).unwrap();

      if (response?.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message || "Auto apply failed.");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Server error during auto apply.");
      console.error(error);
    }

    setIsApplying(false);
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Auto Apply to Jobs
      </h1>

      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="num-candidates" className="whitespace-nowrap">
            Number of Job Applications:
          </label>
          <input
            id="num-candidates"
            type="number"
            min={1}
            value={numberOfCandidates}
            onChange={(e) => setNumberOfCandidates(Number(e.target.value))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleAutoApply}
            disabled={isApplying}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${
              isApplying ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isApplying ? "Applying..." : "Auto Apply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoApplyJobs;
