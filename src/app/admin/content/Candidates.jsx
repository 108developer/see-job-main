import { useBulkUploadCandidatesMutation } from "@/redux/api/candidateAuth";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AutoApplyJobs from "./AutoApplyJobs";

const BulkUploadCandidates = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [isUploading, setIsUploading] = useState(false);

  const [bulkUploadCandidates] = useBulkUploadCandidatesMutation();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 10) {
      toast.error("You can upload a maximum of 10 files.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleCancelFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload.");
      return;
    }

    setIsUploading(true);

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await bulkUploadCandidates(formData).unwrap();

        if (response?.success) {
          toast.success(`Uploaded: ${file.name}`);

          if (response.duplicates?.length) {
            const duplicates = response.duplicates.join(", ");
            toast.info(`Duplicates in ${file.name}: ${duplicates}`);
          }
        } else {
          toast.error(
            `Failed: ${file.name} - ${response?.message || "Unknown error"}`
          );
        }
      } catch (error) {
        const errorMessage =
          error?.data?.message ||
          error?.error ||
          `Error uploading ${file.name}`;
        toast.error(errorMessage);
      }
    }

    setIsUploading(false);
    setSelectedFiles([]);
  };

  return (
    <>
      <div className="flex flex-col w-full gap-4 p-4">
        <h1 className="text-2xl font-bold mb-4">Bulk Upload Candidates</h1>

        {selectedFiles.length === 0 ? (
          <label className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer w-fit">
            <Upload size={18} />
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            Select Files
          </label>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {file.name}
                  </span>
                  <button
                    onClick={() => handleCancelFile(idx)}
                    className="bg-red-500 text-white text-sm px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleBulkUpload}
                disabled={isUploading}
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
              >
                {isUploading ? "Uploading..." : "Upload All"}
              </button>
              <button
                onClick={() => setSelectedFiles([])}
                className="bg-gray-500 text-white text-sm px-3 py-1 rounded"
              >
                Clear All
              </button>
            </div>
          </>
        )}

        <ToastContainer />
      </div>

      <AutoApplyJobs />
    </>
  );
};

export default BulkUploadCandidates;
