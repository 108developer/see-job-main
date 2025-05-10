"use client";

import JobTitleSearchBar from "@/components/graphql-ui/JobTitle";
import JobTypeSearchBar from "@/components/graphql-ui/JobType";
import LocationSearchBar from "@/components/graphql-ui/LocationSearchBar";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";
import { useSaveJobPreferencesMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Edit2 } from "lucide-react";
import moment from "moment";
import Image from "next/image";
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
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
  ],
  language: [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "Other", label: "Other" },
  ],
};

// Validation Schema using Yup
const validationSchema = Yup.object({
  profileTitle: Yup.string().required("Profile title is required"),
  jobType: Yup.string().required("Please select a job type"),
  preferredJobLocation: Yup.array()
    .min(1, "At least one location is required")
    .max(10, "You can select a maximum of 10 locations"),
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
  preferredJobLocation: [],
  experienceYears: "",
  experienceMonths: "",
  gender: "Male",
  dob: new Date(),
  maritalStatus: "",
  language: "",
  currentSalary: "",
  expectedSalary: "",
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
  const [locationSearch, setLocationSearch] = useState("");
  const [preferredJobLocation, setPreferredJobLocation] = useState([]);

  const { userid, token, role } = useSelector((state) => state.auth);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!token || role !== "candidate") {
      router.push("/");
    }
  }, [isClient, token, router, role]);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleLocationSelect = (selectedLocation, setFieldValue) => {
    if (preferredJobLocation.length < 10) {
      setPreferredJobLocation((prevLocations) => {
        const newLocations = [...prevLocations, selectedLocation.fullAddress];
        setTimeout(() => {
          setFieldValue("preferredJobLocation", newLocations);
        }, 0);
        return newLocations;
      });
      setLocationSearch("");
    } else {
      toast.error("You can only select up to 10 locations.");
    }
  };

  const handleRemoveLocation = (location, setFieldValue) => {
    setPreferredJobLocation((prevLocations) => {
      const updatedLocations = prevLocations.filter(
        (item) => item !== location
      );
      setTimeout(() => {
        setFieldValue("preferredJobLocation", updatedLocations);
      }, 0);
      return updatedLocations;
    });
    setLocationSearch("");
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    formData.append("candidateId", userid);
    formData.append("profileTitle", values.profileTitle);
    formData.append("jobType", values.jobType);
    formData.append(
      "preferredJobLocation",
      JSON.stringify(values.preferredJobLocation)
    );
    formData.append("experienceYears", experienceYears);
    formData.append("experienceMonths", experienceMonths);
    formData.append("gender", values.gender);
    formData.append("dob", moment(values.dob).format("DD/MM/YYYY"));
    formData.append("maritalStatus", values.maritalStatus);
    formData.append("language", values.language);
    formData.append("currentSalary", values.currentSalary);
    formData.append("expectedSalary", values.expectedSalary);

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
                  {selectedImage?.startsWith("blob:") ? (
                    <img
                      src={selectedImage}
                      alt="Upload"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={selectedImage || PlaceholderImage}
                      alt="Upload"
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  )}
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
              <label htmlFor="profileTitle" className="text-sm font-medium">
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
              <label htmlFor="jobType" className="text-sm font-medium">
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

            {/* Preferred Job Location */}
            <div>
              <label htmlFor="location" className="text-sm font-medium">
                Preferred Job Location
              </label>
              <LocationSearchBar
                searchTerm={locationSearch}
                onSearchChange={(value) => setLocationSearch(value)}
                setFieldValue={setFieldValue}
                onLocationSelect={(selectedLocation) =>
                  handleLocationSelect(selectedLocation, setFieldValue)
                }
              />
              <ErrorMessage
                name="preferredJobLocation"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Display selected locations with a cross sign */}
            <div className="flex flex-wrap gap-2">
              {preferredJobLocation.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md"
                >
                  <span>{location}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveLocation(location, setFieldValue)
                    }
                    className="text-red-500"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Current Salary */}
            <div>
              <label htmlFor="currentSalary" className="text-sm font-medium">
                Current Salary
              </label>
              <Field
                type="number"
                id="currentSalary"
                name="currentSalary"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Enter current salary"
              />
              <ErrorMessage
                name="currentSalary"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Expected Salary */}
            <div>
              <label htmlFor="expectedSalary" className="text-sm font-medium">
                Expected Salary
              </label>
              <Field
                type="number"
                id="expectedSalary"
                name="expectedSalary"
                className="mt-1 p-3 w-full border rounded-md"
                placeholder="Enter expected salary"
              />
              <ErrorMessage
                name="expectedSalary"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Experience */}
            <div className="text-sm font-medium">
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
              <label className="text-sm font-medium">Gender</label>
              <div className="space-x-4">
                <label>
                  <Field
                    type="radio"
                    name="gender"
                    value="Male"
                    className="mr-2"
                    checked
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

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="text-sm font-medium">
                Date of Birth
              </label>
              <Field name="dob">
                {({ field, form }) => (
                  <DatePicker
                    {...field}
                    selected={field.value || new Date()}
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
              <label htmlFor="maritalStatus" className="text-sm font-medium">
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
              <label htmlFor="language" className="text-sm font-medium">
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
