import { X } from "lucide-react";

const ModalBase = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 overflow-hidden min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:mx-4 md:mx-10 lg:mx-20 relative max-h-[90vh]">
        <button
          className="absolute top-1 right-1 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
};

export default ModalBase;
