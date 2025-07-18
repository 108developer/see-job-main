"use client";

import SEOModal from "@/app/modals/SEOModal";
import { useEmployerLoginMutation } from "@/redux/api/employerAuth";
import { Input } from "@/components/ui/input";
import { login as loginAction } from "@/redux/slices/authSlice";
import { setModal } from "@/redux/slices/modalSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
});

const EmployerLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);
  const [employerLogin, { isLoading, error }] = useEmployerLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleLogin = async (values) => {
    try {
      const { data } = await employerLogin(values);
      if (data?.token) {
        dispatch(
          loginAction({
            token: data.token,
            userid: data.userid,
            useremail: data.email,
            username: data.fullName,
            phone: data.phone,
            role: data.role,
            subscription: data.subscription,
          })
        );
        localStorage.setItem("token", data.token);
        localStorage.setItem("userid", data.userid);
        localStorage.setItem("useremail", data.email);
        localStorage.setItem("username", data.fullName);
        localStorage.setItem("phone", data.phone);
        localStorage.setItem("role", data.role);
        localStorage.setItem("subscription", JSON.stringify(data.subscription));
        // router.push("/");
      }
    } catch (err) {
      console.error("Login Failed: ", err);
    }
  };

  const openForgotPasswordModal = () => {
    dispatch(
      setModal({
        modalType: "forgotPasswordModal",
        modalProps: { role: "employer" },
      })
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full min-h-screen px-4 md:px-10 lg:px-28 py-4">
      {/* Top Boxes Section */}

      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-6">
        <SEOModal slug="employer-login" />
        <div className="flex flex-col gap-6 w-full">
          {/* Box 1: Find CV */}
          <div className="bg-white border shadow rounded-md p-6 w-full">
            <p className="text-black text-lg mb-4 font-medium">
              <strong className="font-bold">Hire people</strong> for your
              business with ease.
              <br />
              Search over 1 crore+ blue-collar and entry-level resumes.
            </p>

            <ul className="list-disc pl-5 mb-4 text-gray-700 text-sm">
              {/* You can add features here if needed */}
            </ul>

            <Link
              href="/find-cv"
              className="bg-yellow-500 text-white text-sm px-4 py-2 rounded hover:bg-yellow-600 transition text-center"
            >
              Find CV
            </Link>
          </div>

          {/* Box 2: Post a Job */}

          <div className="bg-white border shadow rounded-md p-6 w-full">
            <p className="text-black text-lg mb-4 font-medium">
              <strong className="font-bold">Post a job</strong> easily and hire
              your candidate in the fastest way for your company.
            </p>

            <ul className="list-disc pl-5 mb-4 text-gray-700 text-sm">
              {/* Add job-posting highlights if needed */}
            </ul>

            <Link
              href="/post-jobs"
              className="border border-yellow-500 text-yellow-600 text-sm px-4 py-2 rounded hover:bg-yellow-100 transition text-center"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>

      {hasMounted &&
        !token &&
        !(role === "employer" || role === "recruiter") && (
          <div className="w-full md:w-2/3 border shadow rounded-md p-6 bg-white">
            <h1 className="text-2xl items-center flex justify-center">
              Employer Login
            </h1>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              <Form className="space-y-4 w-full">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                  <Field name="password">
                    {({ field }) => (
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="mt-1 p-2 w-full border rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <Eye size={20} />
                          ) : (
                            <EyeClosed size={20} />
                          )}
                        </button>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div
                  className="flex items-center w-full justify-end text-sm text-blue-500 font-semibold cursor-pointer"
                  onClick={openForgotPasswordModal}
                >
                  Forgot Password?
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>

                {/* Show error if login failed */}
                {error && (
                  <div className="text-red-500 mt-2">
                    {error.data.message || "An error occured"}
                  </div>
                )}
              </Form>
            </Formik>
            <div className="border-t mt-6 pt-4 text-center text-sm">
              New User?{" "}
              <Link href={"/employer-signup"}>
                <span className="text-red-600 font-semibold whitespace-nowrap">
                  Sign Up
                </span>
              </Link>
            </div>
          </div>
        )}
    </div>
  );
};

export default EmployerLogin;
