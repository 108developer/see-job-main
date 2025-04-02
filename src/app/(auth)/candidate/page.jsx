"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CandidateLogin from "./CandidateLogin";
import CandidateRegister from "./CandidateRegister";
import { User, UserPlus } from "lucide-react";

const CandidateAuth = ({ closeModal }) => {
  const router = useRouter();
  const [authLogin, setAuthLogin] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="flex flex-col items-center  justify-center w-full">
      <div className="flex justify-center w-full text-lg">
        <div
          className={`cursor-pointer rounded-l-lg py-4 flex gap-2 items-center justify-center w-full ${
            !authLogin ? "text-black bg-gray-400" : "text-red-700 bg-gray-300"
          }`}
          onClick={() => setAuthLogin(true)}
        >
          <User className="h-6 w-6" /> Login
        </div>
        <div
          className={`cursor-pointer rounded-r-lg py-4 flex gap-2 items-center justify-center w-full ${
            authLogin ? "text-black bg-gray-400" : "text-red-700 bg-gray-300"
          }`}
          onClick={() => setAuthLogin(false)}
        >
          <UserPlus className="h-6 w-6" /> Register
        </div>
      </div>

      {authLogin ? (
        <CandidateLogin closeModal={closeModal} />
      ) : (
        <CandidateRegister closeModal={closeModal} />
      )}
    </div>
  );
};

export default CandidateAuth;
