"use client";

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CandidateRegister from "../../candidate/CandidateRegister";

const CandidateRegisterPage = ({ closeModal }) => {
  const router = useRouter();
  const [authLogin, setAuthLogin] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      router.push("/candidate-register-form");
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="flex flex-col items-center justify-center p-4 w-[300px] md:w-1/3 border shadow-lg rounded-md">
        <div
          className={`cursor-pointer rounded-lg py-2 md:py-4 flex gap-2 items-center justify-center w-full ${
            authLogin ? "text-black bg-gray-400" : "text-red-700 bg-gray-300"
          }`}
        >
          <UserPlus className="h-6 w-6" /> Register
        </div>

        <CandidateRegister />

        <Link href={"/candidate-login"}>
          <div className="text-red-500 flex justify-end w-full mt-2 hover:underline cursor-pointer gap-2 text-xs ">
            <UserPlus className="h-4 w-4" />
            Already have an account? Login here
          </div>
        </Link>
      </div>
    </div>
  );
};
export default CandidateRegisterPage;
