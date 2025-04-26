import { X } from "lucide-react";

const ModalBase = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 overflow-hidden min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[300px] md:min-w-[520px] lg:min-w-[720px] max-w-[720px] relative max-h-[90vh] flex flex-col">
        <button
          className="absolute top-1 right-1 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        <div className="overflow-y-auto h-full">{children}</div>
      </div>
    </div>
  );
};

export default ModalBase;
