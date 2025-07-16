"use client";

import { Input } from "@/components/ui/input";
import { useAdminLoginMutation } from "@/redux/api/admin";
import { login as loginAction } from "@/redux/slices/authSlice";
import { setModal } from "@/redux/slices/modalSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AdminLogin = ({ closeModal }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [adminLogin, { isLoading, error }] = useAdminLoginMutation();

  const handleLogin = async (values) => {
    try {
      const response = await adminLogin(values);

      const data = response?.data;
      console.log("DATA", data);
      if (data?.token) {
        dispatch(
          loginAction({
            token: data.token,
            userid: data.adminId,
            useremail: data.email,
            username: data.fullName,
            phone: data.phone,
            role: data.role,
          })
        );

        localStorage.setItem("token", data.token);
        localStorage.setItem("userid", data.adminId);
        localStorage.setItem("useremail", data.adminEmail);
        localStorage.setItem("username", data.adminName);
        localStorage.setItem("phone", data.adminPhone);
        localStorage.setItem("role", data.role);
        router.push("/");
      } else {
        const message =
          response?.error?.data?.message || "Login failed. Please try again.";
        toast.error(message);
      }
    } catch (error) {
      console.error("Login Failed: ", error);
    }
  };

  const openForgotPasswordModal = () => {
    dispatch(
      setModal({
        modalType: "forgotPasswordModal",
        modalProps: { role: "admin" },
      })
    );
  };

  return (
    <div className="flex items-center justify-center w-full py-2 h-screen">
      <div className="w-[300px] md:w-[500px] border rounded-md shadow-lg p-8">
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
                      tabIndex={-1} // avoid tab focus on button
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

            {/* <div
              className="w-full flex items-center justify-end text-blue-500 font-semibold cursor-pointer"
              onClick={openForgotPasswordModal}
            >
              Forgot Password?
            </div> */}

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

export default AdminLogin;
