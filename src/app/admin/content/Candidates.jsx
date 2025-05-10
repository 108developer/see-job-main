import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Upload } from "lucide-react";
import { useBulkUploadCandidatesMutation } from "@/redux/api/candidateAuth";

const BulkUploadCandidates = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedFileName, setSelectedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [bulkUploadCandidates] = useBulkUploadCandidatesMutation();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setSelectedFileName("");
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      const response = await bulkUploadCandidates(formData).unwrap();

      if (response?.success) {
        toast.success("Bulk upload successful!");

        if (response.duplicates?.length) {
          const duplicates = response.duplicates.join(", ");
          toast.info(`Duplicate entries not added: ${duplicates}`);
        }
      } else {
        toast.error(response?.message || "Bulk upload failed.");
      }
    } catch (error) {
      toast.error("An error occurred during bulk upload.");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setSelectedFileName("");
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Bulk Upload Candidates</h1>

      {!selectedFile ? (
        <label className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer w-fit">
          <Upload size={18} />
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />
          Select File
        </label>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm bg-gray-200 px-2 py-1 rounded">
            {selectedFileName}
          </span>
          <button
            onClick={handleCancelUpload}
            className="bg-red-500 text-white text-sm px-2 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleBulkUpload}
            disabled={isUploading}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default BulkUploadCandidates;
