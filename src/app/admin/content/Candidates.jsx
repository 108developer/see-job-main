import { useBulkUploadCandidatesMutation } from "@/redux/api/candidateAuth";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const BulkUploadCandidates = () => {
  // ✅ CHANGE: Replace single file state with array
  const [selectedFiles, setSelectedFiles] = useState([]); // <--- was: selectedFile

  const [isUploading, setIsUploading] = useState(false);

  const [bulkUploadCandidates] = useBulkUploadCandidatesMutation();

  // ✅ CHANGE: Update to handle multiple files + limit
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []); // <--- convert FileList to array
    if (files.length + selectedFiles.length > 10) {
      // <--- enforce max 10 files
      toast.error("You can upload a maximum of 10 files.");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]); // <--- append files
  };

  // ✅ NEW: Remove one file
  const handleCancelFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index); // <--- remove selected
    setSelectedFiles(updatedFiles);
  };

  // ✅ CHANGE: Loop over multiple files for upload
  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      // <--- no files check
      toast.error("Please select files to upload.");
      return;
    }

    setIsUploading(true);

    for (const file of selectedFiles) {
      // <--- loop each file
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
    setSelectedFiles([]); // <--- reset files
  };

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Bulk Upload Candidates</h1>

      {/* ✅ CHANGE: If no files selected, show file picker */}
      {selectedFiles.length === 0 ? (
        <label className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer w-fit">
          <Upload size={18} />
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            multiple // <--- allow multiple
            onChange={handleFileSelect} // <--- updated handler
            className="hidden"
          />
          Select Files
        </label>
      ) : (
        <>
          {/* ✅ NEW: Show all selected files */}
          <div className="flex flex-col gap-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                  {file.name}
                </span>
                <button
                  onClick={() => handleCancelFile(idx)} // <--- remove single file
                  className="bg-red-500 text-white text-sm px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* ✅ NEW: Upload and Clear buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleBulkUpload}
              disabled={isUploading}
              className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
            >
              {isUploading ? "Uploading..." : "Upload All"}
            </button>
            <button
              onClick={() => setSelectedFiles([])} // <--- clear all
              className="bg-gray-500 text-white text-sm px-3 py-1 rounded"
            >
              Clear All
            </button>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default BulkUploadCandidates;
