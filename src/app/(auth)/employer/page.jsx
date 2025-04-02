"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EmployerLogin from "./EmployerLogin";
import EmployerRegister from "./EmployerRegister";

const EmployerAuth = () => {
  const router = useRouter();
  const [authLogin, setAuthLogin] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const toggleAuth = () => {
    setAuthLogin(!authLogin);
  };

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center justify-center border border-gray-300 shadow-lg rounded-lg p-8 w-full sm:w-11/12 md:w-3/4 lg:w-1/3">
        <div className="w-full">
          <h1 className="text-3xl font-semibold text-center">
            {authLogin ? "Candidate Register" : "Candidate Login"}
          </h1>

          {authLogin ? <EmployerRegister /> : <EmployerLogin />}

          <div className="text-center mt-4">
            <h4>
              {authLogin
                ? "Already have an account? "
                : "Don't have an account? "}
              <span
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={toggleAuth}
              >
                {authLogin ? "Login" : "Register"}
              </span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerAuth;
