"use client";

import CityStateCountrySearchBar from "@/components/graphql-ui/CityStateCountrySearchBar";
import { Input } from "@/components/ui/input";
import { useSignupCandidateMutation } from "@/redux/api/candidateAuth";
import { login as loginAction } from "@/redux/slices/authSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(3, "Full Name must be at least 3 characters")
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
  location: Yup.string().required("Location is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.date()
    .nullable()
    .required("Date of Birth is required")
    .typeError("Date must be a valid date"),
});

const initialValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  location: "",
  gender: "Male",
  dob: null,
};

const CandidateRegister = ({ closeModal }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signUpCandidate, { isLoading }] = useSignupCandidateMutation();

  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (values, { resetForm }) => {
    const data = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      location: values.location,
      gender: values.gender,
      dob: values.dob,
    };

    try {
      const response = await signUpCandidate(data).unwrap();

      if (response.token) {
        toast.success(response.message);
        resetForm();
        setLocation("");
        const { token, candidateId, email, phone, role, expiresIn, fullName } =
          response;
        localStorage.setItem("token", token);
        localStorage.setItem("userid", candidateId);
        localStorage.setItem("useremail", email);
        // localStorage.setItem("username", fullName);
        // localStorage.setItem("phone", phone);
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
        // closeModal();
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
                <div className="w-full mb-auto">
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
                <div className="w-full mb-auto">
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

              <div>
                <label htmlFor="location" className="block text-sm font-medium">
                  Current Location
                </label>
                <CityStateCountrySearchBar
                  searchTerm={location}
                  onSearchChange={(value) => setLocation(value)}
                  setFieldValue={setFieldValue}
                  onLocationSelect={(selectedLocation) => {
                    setLocation(selectedLocation.fullAddress);
                    setFieldValue("location", selectedLocation.fullAddress);
                  }}
                  fieldName="location"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Date of Birth */}
              <div className="gap-2 flex flex-col">
                <label htmlFor="dob" className="text-sm font-medium">
                  Date of Birth
                </label>
                <Field name="dob">
                  {({ field }) => (
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue("dob", value || null);
                      }}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="dob"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium">Gender</label>
                <div className="space-x-4">
                  <label>
                    <Field
                      type="radio"
                      name="gender"
                      value="Male"
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="gender"
                      value="Female"
                      className="mr-2"
                    />
                    Female
                  </label>
                  <label>
                    <Field
                      type="radio"
                      name="gender"
                      value="other"
                      className="mr-2"
                    />
                    Other
                  </label>
                </div>
                <ErrorMessage
                  name="gender"
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
