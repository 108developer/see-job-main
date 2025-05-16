import { AlertCircle } from "lucide-react";

import { setModal } from "@/redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";

const AccessDenied = ({ title1, title2 }) => {
  const dispatch = useDispatch();

  const openSignInModal = () => {
    dispatch(setModal({ modalType: "candidateAuth" }));
  };

  const isCandidate =
    title1?.toLowerCase() === "candidate" ||
    title2?.toLowerCase() === "candidate";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center border border-red-200">
        <div className="text-red-600 mb-4">
          <AlertCircle className="w-16 h-16 mx-auto" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-3">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You must be logged in as an{" "}
          <span className="font-semibold text-red-600">{title1}</span> or{" "}
          <span className="font-semibold text-red-600">{title2}</span> to view
          this page.
        </p>
        {isCandidate ? (
          <button
            onClick={openSignInModal}
            className="text-white bg-red-600 hover:bg-red-700 font-semibold px-5 py-2 rounded-md transition duration-200"
          >
            Sign In
          </button>
        ) : (
          <Link
            href="/employer-login"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-md transition duration-200"
          >
            Login Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default AccessDenied;
