"use client";

import LocationSearchBar from "@/components/graphql-ui/LocationSearchBar";
// import IndustrySelectDropDown from "@/components/graphql-ui/IndustrySelectDropDown";
import SkillDropdown from "@/components/graphql-ui/SkillsDropdown";
import { Input } from "@/components/ui/input";
import { useRegisterCandidateMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Static Experience data
const experienceOptions = Array.from({ length: 11 }, (_, i) => i);

// File validation function
const fileValidation = (value, maxSize, allowedTypes) => {
  if (!value) return true;
  return value.size <= maxSize && allowedTypes.includes(value.type);
};

// Validation schema using Yup
const validationSchema = Yup.object({
  location: Yup.string().required("Current Location is required"),
  permanentAddress: Yup.string().required("Permanent Address is required"),
  minexp: Yup.number().required("Required"),
  maxexp: Yup.number().required("Required"),
  skills: Yup.array().min(5, "At least 5 skill is required"),
  // industry: Yup.string().required("Preferred Industry is required"),
  file: Yup.mixed()
    .required("File is required")
    .test("fileSize", "File size is too large", (value) =>
      fileValidation(value, 5000000, ["application/pdf", "application/msword"])
    ),
  jobDescription: Yup.string().required("Summary is required"),
  terms: Yup.boolean()
    .oneOf([true], "You must agree to the terms")
    .required("You must agree to the terms"),
});

// Experience Dropdown component
const ExperienceDropdown = ({
  label,
  id,
  value,
  setValue,
  options,
  disabled,
}) => {
  const handleSelect = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex items-center w-full">
      <div
        htmlFor={id}
        className="p-3 bg-gray-200 rounded-l-md border-2 border-gray-200"
      >
        {label}
      </div>

      <select
        id={id}
        name={id}
        className="p-3 w-full border rounded-r-md"
        value={value}
        onChange={handleSelect}
        disabled={disabled}
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option} years
          </option>
        ))}
      </select>
      <ErrorMessage
        name={id}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

const CandidateRegister = () => {
  const router = useRouter();
  const [registerCandidate, { isLoading }] = useRegisterCandidateMutation();
  const [location, setLocation] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  // const [industry, setIndustry] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSet, setSkillSet] = useState("");

  const { userid, useremail, token, phone, username, role } = useSelector(
    (state) => state.auth
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!token || role !== "candidate") {
      router.push("/");
    }
  }, [isClient, token, router, role]);

  const initialValues = {
    fullName: username || "",
    email: useremail || "",
    password: "",
    phone: phone || "",
    location: "",
    permanentAddress: "",
    minexp: "",
    maxexp: "",
    skills: [],
    // industry: "",
    file: null,
    jobDescription: "",
    terms: false,
  };

  const handleRegister = async (values, { resetForm }) => {
    const formData = new FormData();

    formData.append("candidateId", userid);
    formData.append("location", values.location);
    formData.append("permanentAddress", values.permanentAddress);
    formData.append("minexp", values.minexp);
    formData.append("maxexp", values.maxexp);
    formData.append(
      "skills",
      selectedSkills.map((skill) => skill.name)
    );
    // formData.append("industry", values.industry);
    formData.append("jobDescription", values.jobDescription);
    formData.append("terms", values.terms);

    if (values.file) {
      formData.append("resume", values.file);
    }

    try {
      const response = await registerCandidate(formData).unwrap();

      if (response.success) {
        toast.success(response.message);
        resetForm();
        router.push("/candidate-education-details");
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
    <div className="w-full py-6 px-28">
      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6 w-full">
            {/* Full Name (Disabled) */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium">
                Full Name
              </label>
              <Field
                type="text"
                id="fullName"
                name="fullName"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="John Doe"
                disabled
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Email (Disabled) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="abc@gmail.com"
                disabled
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="*****"
                disabled
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Phone (Disabled) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone
              </label>
              <div className="flex items-center">
                <div className="p-3 bg-gray-200 rounded-l-md border-2 border-gray-200">
                  +91
                </div>

                <Field
                  type="text"
                  id="phone"
                  name="phone"
                  className="p-3 w-full border rounded-r-md"
                  placeholder="10-digit Number"
                  disabled
                />
              </div>
              <ErrorMessage
                name="phone"
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
                fieldName="location"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Permanent Address */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium">
                Permanent Address
              </label>
              <LocationSearchBar
                searchTerm={permanentAddress}
                onSearchChange={(value) => setPermanentAddress(value)}
                setFieldValue={setFieldValue}
                onLocationSelect={(selectedPermanentAddress) => {
                  setPermanentAddress(selectedPermanentAddress.fullAddress);
                  setFieldValue(
                    "permanentAddress",
                    selectedPermanentAddress.fullAddress
                  );
                }}
                fieldName="permanentAddress"
              />
              <ErrorMessage
                name="permanentAddress"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Experience */}
            <div className="block text-sm font-medium">
              <h1> Experience (in years)</h1>

              <div className="flex items-center gap-8 justify-between flex-col lg:flex-row">
                {/* Min Experience */}
                <ExperienceDropdown
                  label="Min"
                  id="minexp"
                  value={minExp}
                  setValue={(val) => {
                    setMinExp(val);
                    setFieldValue("minexp", val);
                  }}
                  options={experienceOptions.filter(
                    (opt) => opt <= (maxExp || 10)
                  )}
                />

                {/* Max Experience */}
                <ExperienceDropdown
                  label="Max"
                  id="maxexp"
                  value={maxExp}
                  setValue={(val) => {
                    setMaxExp(val);
                    setFieldValue("maxexp", val);
                  }}
                  options={experienceOptions.filter(
                    (opt) => opt >= (minExp || 0)
                  )}
                />
              </div>
            </div>

            {/* Key Skills */}
            <div className="w-full mb-auto">
              <label htmlFor="skills" className="block text-sm font-medium">
                Key Skills*
              </label>
              <label htmlFor="skills" className="text-xs">
                Add more skills to increase your visibility and improve your
                chances of getting shortlisted.
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

            {/* Preferred Industry */}
            {/* <div className="w-full mb-auto">
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
            </div> */}

            {/* File Upload (Resume Only) */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium">
                Upload Your Resume
              </label>
              {/* <input
                type="file"
                id="file"
                name="file"
                className="mt-1 p-3 w-full border rounded-md"
                accept=".pdf, .doc, .docx"
              /> */}
              <Input
                id="file"
                type="file"
                onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                }}
                accept=".pdf,.doc,.docx"
              />

              <ErrorMessage
                name="file"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            {/* Job Description */}
            <div>
              <label
                htmlFor="jobDescription"
                className="block text-sm font-medium"
              >
                Summary
              </label>
              <Field
                type="text"
                id="jobDescription"
                name="jobDescription"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Summary"
              />
              <ErrorMessage
                name="jobDescription"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="inline-flex items-center">
                <Field type="checkbox" name="terms" className="form-checkbox" />
                <span className="ml-2 text-sm">
                  I agree to use the above details to create my Jobseeker
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
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Next Education Detail"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CandidateRegister;
