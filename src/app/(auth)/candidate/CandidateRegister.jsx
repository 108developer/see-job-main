"use client";

import { useSignupCandidateMutation } from "@/redux/api/candidateAuth";
import { login as loginAction } from "@/redux/slices/authSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(6, "Full Name must be at least 6 characters")
    .required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be valid")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const initialValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
};

const CandidateRegister = ({ closeModal }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signUpCandidate, { isLoading }] = useSignupCandidateMutation();

  const handleRegister = async (values, { resetForm }) => {
    const data = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    };

    try {
      const response = await signUpCandidate(data).unwrap();

      if (response.token) {
        toast.success(response.message);
        resetForm();
        const { token, candidateId, email, phone, role, expiresIn, fullName } =
          response;
        localStorage.setItem("token", token);
        localStorage.setItem("userid", candidateId);
        localStorage.setItem("useremail", email);
        localStorage.setItem("username", fullName);
        localStorage.setItem("phone", phone);
        localStorage.setItem("role", role);
        localStorage.setItem("expiresIn", expiresIn);
        dispatch(
          loginAction({
            token,
            userid: candidateId,
            useremail: email,
            username: fullName,
            phone,
            role,
            expiresIn,
          })
        );
        closeModal();
        router.push("/candidate-register-form");
      } else {
        toast.error(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center w-full py-2">
      <div className="w-full">
        {/* Formik form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium">
                  Full Name
                </label>
                <Field
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="mt-1 p-2 w-full border rounded-md"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                {/* Email Field */}
                <div className="w-full">
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

                {/* Phone Field */}
                <div className="w-full">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    id="phone"
                    name="phone"
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              {/* Password Field */}
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                disabled={isLoading} // Disable while loading
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CandidateRegister;
