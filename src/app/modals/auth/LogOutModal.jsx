import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";

const LogoutModal = ({ closeModal }) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(logout());
    closeModal();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <h2 className="text-lg font-bold">Are you sure you want to log out?</h2>
      <div className="flex gap-4">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Yes, Sign Out
        </button>
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
