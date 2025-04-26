"use client";

import IndustrySelectDropDown from "@/components/graphql-ui/IndustrySelectDropDown";
import LocationSearchBar from "@/components/graphql-ui/LocationSearchBar";
import SkillDropdown from "@/components/graphql-ui/SkillsDropdown";
import { useEmployerRegistrationMutation } from "@/redux/api/employerAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters, contain at least one uppercase letter, one number, and one special character"
    )
    .required("Password is required"),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits")
    .required("Mobile Number is required"),
  location: Yup.string().required("Location is required"),
  companyName: Yup.string().required("Current Company Name is required"),
  designation: Yup.string().required("Current Designation is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("Zip Code is required"),
  state: Yup.string().required("State is required"),
  totalExperience: Yup.string().required("Total Experience is required"),
  level: Yup.string().required("Level is required"),
  industry: Yup.string().required("Industry is required"),
  skills: Yup.array().min(1, "At least one skill is required"),
  achievements: Yup.string(),
  description: Yup.string(),
  terms: Yup.boolean()
    .oneOf([true], "You must agree to the terms")
    .required("You must agree to the terms"),
});

const TOTAL_EXPERIENCE = ["1-3 years", "4-6 years", "7-10 years", "10+ years"];

const LEVELS = ["Junior", "Mid-level", "Senior", "Lead"];

const RecruiterProfile = () => {
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSet, setSkillSet] = useState("");
  const router = useRouter();

  const [employerRegister, { isLoading }] = useEmployerRegistrationMutation();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    location: "",
    skills: [],
    companyName: "",
    designation: "",
    address: "",
    city: "",
    zipCode: "",
    state: "",
    totalExperience: "",
    level: "",
    industry: "",
    achievements: "",
    description: "",
    terms: false,
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobileNumber: values.mobileNumber,
        password: values.password,
        location: values.location,
        skills: selectedSkills.map((skill) => skill.name),
        companyName: values.companyName,
        designation: values.designation,
        address: values.address,
        city: values.city,
        zipCode: values.zipCode,
        state: values.state,
        totalExperience: values.totalExperience,
        level: values.level,
        industry: values.industry,
        achievements: values.achievements,
        description: values.description,
        terms: values.terms,
      };

      const response = await employerRegister(formData);

      if (response.data && response.data.success) {
        resetForm();
        router.push("/candidate-education-details");
        toast.success(response.data.message);
      } else {
        toast.error(
          response.data?.message || "Registration failed. Please try again."
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
    <div className="w-full py-6 px-28">
      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6 w-full">
            {/* First Name */}
            <div>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="First Name"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Last Name */}
            <div>
              <Field
                type="text"
                id="lastName"
                name="lastName"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Last Name"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <Field
                type="email"
                id="email"
                name="email"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <Field
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Mobile Number"
              />
              <ErrorMessage
                name="mobileNumber"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <Field
                type="password"
                id="password"
                name="password"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Current Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium">
                Current Location
              </label>
              <LocationSearchBar
                searchTerm={location}
                onSearchChange={(value) => setLocation(value)}
                setFieldValue={setFieldValue}
                onLocationSelect={(selectedLocation) => {
                  setLocation(selectedLocation.fullAddress);
                  setFieldValue("location", selectedLocation.fullAddress);
                }}
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Key Skills */}
            <div className="w-full mb-auto">
              <label htmlFor="skills" className="block text-sm font-medium">
                Key Skills*
              </label>
              <SkillDropdown
                searchTerm={skillSet}
                onSearchChange={(value) => setSkillSet(value)}
                setFieldValue={setFieldValue}
                onSkillSelect={(selectedSkill) => {
                  setSelectedSkills([...selectedSkills, selectedSkill]);
                  setFieldValue("skills", [...selectedSkills, selectedSkill]);
                }}
                onRemoveSkill={(skillToRemove) => {
                  const updatedSkills = selectedSkills.filter(
                    (skill) => skill !== skillToRemove
                  );
                  setSelectedSkills(updatedSkills);
                  setFieldValue("skills", updatedSkills);
                }}
              />
              <ErrorMessage
                name="skills"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Current Company Name */}
            <div>
              <Field
                type="text"
                id="companyName"
                name="companyName"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Current Company Name"
              />
              <ErrorMessage
                name="companyName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Current Designation */}
            <div>
              <Field
                type="text"
                id="designation"
                name="designation"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Current Designation"
              />
              <ErrorMessage
                name="designation"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Address */}
            <div>
              <Field
                type="text"
                id="address"
                name="address"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Address"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* City */}
            <div>
              <Field
                type="text"
                id="city"
                name="city"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="City"
              />
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Zip Code */}
            <div>
              <Field
                type="text"
                id="zipCode"
                name="zipCode"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Zip Code"
              />
              <ErrorMessage
                name="zipCode"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* State */}
            <div>
              <Field
                type="text"
                id="state"
                name="state"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="State"
              />
              <ErrorMessage
                name="state"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Total Experience (Dropdown) */}
            <div>
              <Field
                as="select"
                id="totalExperience"
                name="totalExperience"
                className="mt-1 p-3 w-full border rounded-md"
              >
                <option value="">Select Experience</option>
                {TOTAL_EXPERIENCE.map((exp, index) => (
                  <option key={index} value={exp}>
                    {exp}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="totalExperience"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Level (Dropdown) */}
            <div>
              <Field
                as="select"
                id="level"
                name="level"
                className="mt-1 p-3 w-full border rounded-md"
              >
                <option value="">Select Level</option>
                {LEVELS.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="level"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Preferred Industry */}
            <div className="w-full mb-auto">
              <label htmlFor="industry" className="block text-sm font-medium">
                Preferred Industry*
              </label>
              <IndustrySelectDropDown
                searchTerm={industry}
                onSearchChange={(value) => setIndustry(value)}
                setFieldValue={setFieldValue}
                onIndustrySelect={(selectedIndustry) => {
                  setIndustry(selectedIndustry.name);
                  setFieldValue("industry", selectedIndustry.name);
                }}
              />
              <ErrorMessage
                name="industry"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Achievements */}
            <div>
              <Field
                type="text"
                id="achievements"
                name="achievements"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Achievements"
              />
              <ErrorMessage
                name="achievements"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Field
                type="text"
                id="description"
                name="description"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Description"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="inline-flex items-center">
                <Field type="checkbox" name="terms" className="form-checkbox" />
                <span className="ml-2 text-sm">
                  I agree to use the above details to create my Recruiter
                  Profile & display it on the SeeJob site and also agree to be
                  bound by the Terms of Use & Privacy of SeeJob.
                </span>
              </label>
              <ErrorMessage
                name="terms"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-fit px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Create Profile
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RecruiterProfile;
