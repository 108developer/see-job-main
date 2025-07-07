// EDITED

"use client";

import { useLoginCandidateMutation } from "@/redux/api/candidateAuth";
import { login as loginAction } from "@/redux/slices/authSlice";
import { setModal } from "@/redux/slices/modalSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const CandidateLogin = ({ closeModal }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [candidateLogin, { isLoading, error }] = useLoginCandidateMutation();

  const handleLogin = async (values) => {
    try {
      const { data } = await candidateLogin(values);
      if (data?.token) {
        dispatch(
          loginAction({
            token: data.token,
            userid: data.candidateId,
            useremail: data.email,
            username: data.fullName,
            phone: data.phone,
            role: data.role,
          })
        );
        localStorage.setItem("token", data.token);
        localStorage.setItem("userid", data.candidateId);
        localStorage.setItem("useremail", data.email);
        localStorage.setItem("username", data.fullName);
        localStorage.setItem("phone", data.phone);
        localStorage.setItem("role", data.role);
        // closeModal();
        router.push("/");
      }
    } catch (err) {
      console.error("Login Failed: ", err);
    }
  };

  const openForgotPasswordModal = () => {
    dispatch(
      setModal({
        modalType: "forgotPasswordModal",
        modalProps: { role: "candidate" },
      })
    );
  };

  return (
    <div className="flex items-center justify-center w-full py-2">
      <div className="w-full">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form className="space-y-4">
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
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="mt-1 p-2 w-full border rounded-md"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div
              className="w-full flex items-center justify-end text-blue-500 font-semibold cursor-pointer"
              onClick={openForgotPasswordModal}
            >
              Forgot Password?
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            {/* Show error if login failed */}
            {error && (
              <div className="text-red-500 text-sm mt-2">
                Login failed: {error.message}
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CandidateLogin;
