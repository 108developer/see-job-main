"use client";

import JobTitleSearchBar from "@/components/graphql-ui/JobTitle";
import JobTypeSearchBar from "@/components/graphql-ui/JobType";
import { useSaveJobPreferencesMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Edit2 } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Static Experience data
const experienceOptions = Array.from({ length: 11 }, (_, i) => i);

// Job Preferences options
const formOptions = {
  maritalStatus: [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ],
  language: [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
  ],
};

// Validation Schema using Yup
const validationSchema = Yup.object({
  profileTitle: Yup.string().required("Profile title is required"),
  jobType: Yup.string().required("Please select a job type"),
  experienceYears: Yup.number()
    .required("Experience in years is required")
    .min(0, "Experience cannot be negative"),
  experienceMonths: Yup.number()
    .required("Experience in months is required")
    .min(0, "Months cannot be negative")
    .max(12, "Months cannot exceed 12"),
  gender: Yup.string().required("Please select a gender"),
  dob: Yup.date().required("Please select your date of birth"),
  maritalStatus: Yup.string().required("Please select marital status"),
  language: Yup.string().required("Please select a language"),
});

const initialValues = {
  candidateId: "",
  profilePic: null,
  profileTitle: "",
  jobType: "",
  experienceYears: "",
  experienceMonths: "",
  gender: "male",
  dob: new Date(),
  maritalStatus: "",
  language: "",
};

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

const JobPreferences = () => {
  const router = useRouter();
  const [saveJobPreferences, { isLoading }] = useSaveJobPreferencesMutation();
  const [experienceYears, setExperienceYears] = useState("");
  const [experienceMonths, setExperienceMonths] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");

  const { userid, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    formData.append("candidateId", userid);
    formData.append("profileTitle", values.profileTitle);
    formData.append("jobType", values.jobType);
    formData.append("experienceYears", experienceYears);
    formData.append("experienceMonths", experienceMonths);
    formData.append("gender", values.gender);
    formData.append("dob", moment(values.dob).format("DD/MM/YYYY"));
    formData.append("maritalStatus", values.maritalStatus);
    formData.append("language", values.language);

    if (selectedImage) {
      formData.append("profilePic", selectedImage);
    } else {
      formData.append("profilePic", null);
    }

    try {
      const response = await saveJobPreferences(formData).unwrap();

      toast.success("Job preferences submitted successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Submission failed. Please try again.");
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
            {/* Upload Image */}
            <div className="flex justify-center items-center">
              <label htmlFor="image" className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                  <img
                    src={selectedImage || "/default-avatar.png"}
                    alt="Upload"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 p-1 bg-gray-200 rounded-full">
                  <Edit2 className="w-6 h-6 text-gray-600" />
                </div>
              </label>
              <input
                type="file"
                id="image"
                name="profilePic"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Profile Title */}
            <div>
              <label
                htmlFor="profileTitle"
                className="block text-sm font-medium"
              >
                Profile Title
              </label>
              <JobTitleSearchBar
                searchTerm={jobTitle}
                onSearchChange={(value) => setJobTitle(value)}
                setFieldValue={setFieldValue}
                onJobTitleSelect={(selectedJobTitle) => {
                  setJobTitle(selectedJobTitle.label);
                  setFieldValue("profileTitle", selectedJobTitle.label);
                }}
              />
              <ErrorMessage
                name="profileTitle"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Job Type */}
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium">
                Job Type
              </label>
              <JobTypeSearchBar
                searchTerm={jobType}
                onSearchChange={(value) => setJobType(value)}
                setFieldValue={setFieldValue}
                onJobTypeSelect={(selectedJobType) => {
                  setJobType(selectedJobType.label);
                  setFieldValue("jobType", selectedJobType.label);
                }}
              />
              <ErrorMessage
                name="jobType"
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
                  id="experienceYears"
                  value={experienceYears}
                  setValue={(val) => {
                    setExperienceYears(val);
                    setFieldValue("experienceYears", val);
                  }}
                  options={experienceOptions.filter(
                    (opt) => opt <= (experienceMonths || 10)
                  )}
                />

                {/* Max Experience */}
                <ExperienceDropdown
                  label="Max"
                  id="experienceMonths"
                  value={experienceMonths}
                  setValue={(val) => {
                    setExperienceMonths(val);
                    setFieldValue("experienceMonths", val);
                  }}
                  options={experienceOptions.filter(
                    (opt) => opt >= (experienceYears || 0)
                  )}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <div className="space-x-4">
                <label>
                  <Field
                    type="radio"
                    name="gender"
                    value="male"
                    className="mr-2"
                    checked
                  />
                  Male
                </label>
                <label>
                  <Field
                    type="radio"
                    name="gender"
                    value="female"
                    className="mr-2"
                  />
                  Female
                </label>
                <label>
                  <Field
                    type="radio"
                    name="gender"
                    value="preferNotToSpecify"
                    className="mr-2"
                  />
                  Prefer Not to Specify
                </label>
              </div>
              <ErrorMessage
                name="gender"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium">
                Date of Birth
              </label>
              <Field name="dob">
                {({ field, form }) => (
                  <DatePicker
                    {...field}
                    selected={field.value || new Date()} // Ensure it has a fallback
                    onChange={(date) => setFieldValue("dob", date)}
                    className="mt-1 p-3 w-full border rounded-md"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select your date of birth"
                  />
                )}
              </Field>
              <ErrorMessage
                name="dob"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Marital Status */}
            <div>
              <label
                htmlFor="maritalStatus"
                className="block text-sm font-medium"
              >
                Marital Status
              </label>
              <Field
                as="select"
                id="maritalStatus"
                name="maritalStatus"
                className="mt-1 p-3 w-full border rounded-md"
              >
                <option value="">Select Marital Status</option>
                {formOptions.maritalStatus.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="maritalStatus"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium">
                Language
              </label>
              <Field
                as="select"
                id="language"
                name="language"
                className="mt-1 p-3 w-full border rounded-md"
              >
                <option value="">Select Language</option>
                {formOptions.language.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="language"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 mt-4 bg-blue-600 text-white rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default JobPreferences;
