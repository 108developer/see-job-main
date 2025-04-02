"use client";

import { useEmployerLoginMutation } from "@/redux/api/authApi";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { login } from "@/redux/slices/authSlice";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const EmployerLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [employerLogin, { isLoading, error }] = useEmployerLoginMutation();

  const handleLogin = async (values) => {
    try {
      const { data } = await employerLogin(values);
      if (data?.token) {
        dispatch(
          login({
            token: data.token,
            username: data.username,
            useremail: data.email,
            role: data.role,
            expiresIn: data.expiresIn,
          })
        );
        router.push("/");
      }
    } catch (err) {
      console.error("Login Failed: ", err);
    }
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

            {error && (
              <div className="text-red-500 text-sm mt-2">
                Login failed. Please check your credentials and try again.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default EmployerLogin;
