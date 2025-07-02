import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const BulkUploadSkillsModal = ({ isOpen, onClose, onSubmit }) => {
  const [textareaValue, setTextareaValue] = useState("");

  const handleSubmit = () => {
    const paragraph = textareaValue.trim();

    if (!paragraph) {
      toast.error("Please enter some skills.");
      return;
    }

    onSubmit({ paragraph }); // Send paragraph to backend
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Bulk Upload Skills</h2>

        <textarea
          className="w-full border p-3 rounded-lg h-[320px] resize-none"
          placeholder="Enter one skill per line..."
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
        />

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadSkillsModal;
