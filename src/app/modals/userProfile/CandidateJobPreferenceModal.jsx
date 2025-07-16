import CityStateCountrySearchBar from "@/components/graphql-ui/CityStateCountrySearchBar";
import JobTitleSearchBar from "@/components/graphql-ui/JobTitle";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateJobPreferencesMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";

import { validationJobPreference } from "./validationSchemas";

const GENDER = ["Male", "Female", "Other"];
const JOB_TYPE = ["Full Time", "Part Time", "On-Site", "Hybrid", "Remote"];
const LANGUAGES = ["English", "Hindi", "Spanish", "French", "Other"];
const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"];

const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") return date.split("T")[0];
  // If it's a Date object
  return date.toISOString().split("T")[0];
};

const minDOB = new Date();
minDOB.setFullYear(minDOB.getFullYear() - 100);

const maxDOB = new Date();
maxDOB.setFullYear(maxDOB.getFullYear() - 18);

const CandidateJobPreferences = ({ initialJobPreference, closeModal }) => {
  const [updateJobPreferences, { isLoading }] =
    useUpdateJobPreferencesMutation();

  // Sync selectedJobTypes and selectedLanguages from initialJobPreference on mount
  const [selectedJobTypes, setSelectedJobTypes] = useState(
    initialJobPreference.jobType || []
  );
  const [selectedLanguages, setSelectedLanguages] = useState(
    initialJobPreference.language || []
  );
  const [preferredJobLocation, setPreferredJobLocation] = useState(
    initialJobPreference.preferredJobLocation || []
  );
  const [jobTitle, setJobTitle] = useState(
    initialJobPreference.profileTitle || ""
  );
  const [locationSearch, setLocationSearch] = useState("");

  const { userid, token } = initialJobPreference;
  const userId = userid?.userid;
  const authToken = token?.token;

  if (!userId) {
    toast.error("User ID is missing");
    return null;
  }

  // Add item to multiselect (jobType, language)
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

  // Remove item from multiselect
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

  // Handle preferred job location selection
  const handleLocationSelect = (selectedLocation, setFieldValue) => {
    if (preferredJobLocation.length < 10) {
      const newLocations = [
        ...preferredJobLocation,
        selectedLocation.fullAddress,
      ];
      setPreferredJobLocation(newLocations);
      setFieldValue("preferredJobLocation", newLocations);
      setLocationSearch("");
    } else {
      toast.error("You can only select up to 10 locations.");
    }
  };

  // Remove a selected location
  const handleRemoveLocation = (location, setFieldValue) => {
    const updatedLocations = preferredJobLocation.filter(
      (loc) => loc !== location
    );
    setPreferredJobLocation(updatedLocations);
    setFieldValue("preferredJobLocation", updatedLocations);
  };

  // Submit handler
  const handleSubmit = async (values, { resetForm }) => {
    const body = {
      profileTitle: values.profileTitle,
      jobType: values.jobType,
      preferredJobLocation: values.preferredJobLocation,
      gender: values.gender,
      dob: formatDate(values.dob),
      maritalStatus: values.maritalStatus,
      language: values.language,
      currentSalary: values.currentSalary,
      expectedSalary: values.expectedSalary,
    };

    try {
      const response = await updateJobPreferences({
        userid: userId,
        token: authToken,
        jobData: body,
      }).unwrap();

      if (response.success) {
        toast.success(response.message);
        resetForm();
        closeModal();
        window.location.reload();
      } else {
        toast.error(response.message || "Update failed. Please try again.");
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <Formik
      initialValues={{
        ...initialJobPreference,
        dob: formatDate(initialJobPreference.dob),
        jobType: initialJobPreference.jobType || [],
        language: initialJobPreference.language || [],
        preferredJobLocation: initialJobPreference.preferredJobLocation || [],
      }}
      validationSchema={validationJobPreference}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
        <Form className="space-y-6 w-full">
          {/* Profile Title */}
          <div>
            <label htmlFor="profileTitle" className="block text-sm font-medium">
              Profile Title
            </label>
            <JobTitleSearchBar
              searchTerm={jobTitle}
              onSearchChange={setJobTitle}
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
            <label className="block text-sm font-medium">Job Type</label>
            <Select
              onValueChange={(val) =>
                addToMultiSelect(
                  val,
                  selectedJobTypes,
                  setSelectedJobTypes,
                  setFieldValue,
                  "jobType"
                )
              }
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
                    disabled={selectedJobTypes.includes(type)}
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Job Types as chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedJobTypes.map((type) => (
                <span
                  key={type}
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

          {/* Preferred Job Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Preferred Job Location
            </label>
            <CityStateCountrySearchBar
              searchTerm={locationSearch}
              onSearchChange={setLocationSearch}
              setFieldValue={setFieldValue}
              onLocationSelect={(loc) =>
                handleLocationSelect(loc, setFieldValue)
              }
              fieldName="preferredJobLocation"
            />
            <ErrorMessage
              name="preferredJobLocation"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Display selected locations */}
          <div className="flex flex-wrap gap-2">
            {preferredJobLocation.map((loc) => (
              <div
                key={loc}
                className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md"
              >
                <span>{loc}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLocation(loc, setFieldValue)}
                  className="text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Current Salary */}
          <div>
            <label
              htmlFor="currentSalary"
              className="block text-sm font-medium"
            >
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
            <label
              htmlFor="expectedSalary"
              className="block text-sm font-medium"
            >
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

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <div className="space-x-4">
              {GENDER.map((g) => (
                <label key={g}>
                  <Field
                    type="radio"
                    name="gender"
                    value={g}
                    className="mr-2"
                  />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
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
              {({ field }) => (
                <Input
                  type="date"
                  {...field}
                  value={field.value || ""}
                  max={maxDOB.toISOString().split("T")[0]}
                  min={minDOB.toISOString().split("T")[0]}
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
                {MARITAL_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
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
              onValueChange={(val) =>
                addToMultiSelect(
                  val,
                  selectedLanguages,
                  setSelectedLanguages,
                  setFieldValue,
                  "language"
                )
              }
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

            {/* Selected languages as chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedLanguages.map((lang) => (
                <span
                  key={lang}
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

          {/* Submit and Cancel Buttons */}
          <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4">
            <button
              type="button"
              className="w-fit px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-fit px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CandidateJobPreferences;
