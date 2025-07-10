"use client";

import CityStateCountrySearchBar from "@/components/graphql-ui/CityStateCountrySearchBar";
import JobTitleSearchBar from "@/components/graphql-ui/JobTitle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";
import { useSaveJobPreferencesMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Edit2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

const JOB_TYPE = ["Full Time", "Part Time", "On-Site", "Hybrid", "Remote"];
const LANGUAGES = ["English", "Hindi", "Spanish", "French", "Other"];
const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"];

// Validation Schema using Yup
const validationSchema = Yup.object({
  // profileTitle: Yup.string().required("Profile title is required"),
  jobType: Yup.array().min(1, "Select at least one job type"),
  preferredJobLocation: Yup.array()
    .min(1, "At least one location is required")
    .max(10, "You can select a maximum of 10 locations"),
  maritalStatus: Yup.string().required("Please select marital status"),
  language: Yup.array().min(1, "Select at least one language"),
});

const initialValues = {
  candidateId: "",
  profilePic: null,
  // profileTitle: "",
  jobType: [],
  preferredJobLocation: [],
  maritalStatus: "",
  language: [],
  currentSalary: "",
  expectedSalary: "",
};

const JobPreferences = () => {
  const router = useRouter();
  const [saveJobPreferences, { isLoading }] = useSaveJobPreferencesMutation();
  const [jobTitle, setJobTitle] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [preferredJobLocation, setPreferredJobLocation] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const addToMultiSelect = (
    item,
    selectedList,
    setSelectedList,
    setFieldValue,
    fieldName
  ) => {
    if (!selectedList.includes(item)) {
      const updated = [...selectedList, item];
      setSelectedList(updated);
      setFieldValue(fieldName, updated);
    }
  };

  const removeFromMultiSelect = (
    item,
    selectedList,
    setSelectedList,
    setFieldValue,
    fieldName
  ) => {
    const updated = selectedList.filter((i) => i !== item);
    setSelectedList(updated);
    setFieldValue(fieldName, updated);
  };

  const { userid, token, role } = useSelector((state) => state.auth);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!token || role !== "candidate") {
      router.push("/");
    }
  }, [isClient, token, router, role]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

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
    // formData.append("profileTitle", values.profileTitle);
    formData.append("jobType", JSON.stringify(values.jobType));

    formData.append(
      "preferredJobLocation",
      JSON.stringify(values.preferredJobLocation)
    );
    formData.append("maritalStatus", values.maritalStatus);
    formData.append("language", JSON.stringify(values.language));
    formData.append("currentSalary", values.currentSalary);
    formData.append("expectedSalary", values.expectedSalary);

    if (selectedImage) {
      formData.append("profilePic", selectedImage);
    }

    try {
      const response = await saveJobPreferences(formData).unwrap();

      if (response.success) {
        router.push("/profile/candidate");
        resetForm();
        toast.success("Job preferences submitted successfully!");
      } else {
        toast.error(response.message || "Saving failed. Please try again.");
      }
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
        {({ setFieldValue, values }) => (
          <Form className="space-y-6 w-full">
            {/* Upload Image */}
            <div className="flex justify-center items-center">
              <label htmlFor="image" className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Upload"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={PlaceholderImage}
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
            {/* <div>
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
            </div> */}

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium">Job Type</label>
              <Select
                onValueChange={(val) => {
                  if (!selectedJobTypes.includes(val)) {
                    const updated = [...selectedJobTypes, val];
                    setSelectedJobTypes(updated);
                    setFieldValue("jobType", updated);
                  }
                }}
              >
                <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                  <SelectValue placeholder="Select Job Type">
                    {selectedJobTypes.length === 0
                      ? "Select Job Type"
                      : selectedJobTypes.length === JOB_TYPE.length
                      ? "All selected"
                      : "Select more"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {JOB_TYPE.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      disabled={selectedJobTypes.includes(type)} // disable if already selected
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedJobTypes.map((type, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {type}
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() =>
                        removeFromMultiSelect(
                          type,
                          selectedJobTypes,
                          setSelectedJobTypes,
                          setFieldValue,
                          "jobType"
                        )
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <ErrorMessage
                name="jobType"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
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

            {/* Marital Status */}
            <div>
              <label htmlFor="maritalStatus" className="text-sm font-medium">
                Marital Status
              </label>
              <Select
                value={values.maritalStatus}
                onValueChange={(val) => setFieldValue("maritalStatus", val)}
              >
                <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  {MARITAL_STATUS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage
                name="maritalStatus"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium">Language</label>
              <Select
                onValueChange={(val) => {
                  if (!selectedLanguages.includes(val)) {
                    const updated = [...selectedLanguages, val];
                    setSelectedLanguages(updated);
                    setFieldValue("language", updated);
                  }
                }}
              >
                <SelectTrigger className="w-full p-3 border rounded-md text-sm">
                  <SelectValue placeholder="Select Language">
                    {selectedLanguages.length === 0
                      ? "Select Language"
                      : selectedLanguages.length === LANGUAGES.length
                      ? "All selected"
                      : "Select more"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem
                      key={lang}
                      value={lang}
                      disabled={selectedLanguages.includes(lang)}
                    >
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected Languages */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedLanguages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    {lang}
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() =>
                        removeFromMultiSelect(
                          lang,
                          selectedLanguages,
                          setSelectedLanguages,
                          setFieldValue,
                          "language"
                        )
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <ErrorMessage
                name="language"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Preferred Job Location */}
            <div>
              <label htmlFor="location" className="text-sm font-medium">
                Preferred Job Location
              </label>
              <CityStateCountrySearchBar
                searchTerm={locationSearch}
                onSearchChange={(value) => setLocationSearch(value)}
                setFieldValue={setFieldValue}
                onLocationSelect={(selectedLocation) =>
                  handleLocationSelect(selectedLocation, setFieldValue)
                }
                fieldName="preferredJobLocation"
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
