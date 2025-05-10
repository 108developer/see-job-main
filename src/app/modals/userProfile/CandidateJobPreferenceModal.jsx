"use client";

import JobTitleSearchBar from "@/components/graphql-ui/JobTitle";
import JobTypeSearchBar from "@/components/graphql-ui/JobType";
import LocationSearchBar from "@/components/graphql-ui/LocationSearchBar";
import { useUpdateJobPreferencesMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import moment from "moment";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
// import { ExperienceDropdown } from "./ExperienceDropdown";
import { validationJobPreference } from "./validationSchemas";

const experienceOptions = Array.from({ length: 11 }, (_, i) => i);

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

const formatDate = (date) => {
  if (!date) return "";
  return date.split("T")[0];
};

const CandidateJobPreferences = ({ initialJobPreference, closeModal }) => {
  const [updateJobPreferences, { isLoading }] =
    useUpdateJobPreferencesMutation();
  // const [experienceYears, setExperienceYears] = useState("");
  // const [experienceMonths, setExperienceMonths] = useState("");
  const [jobTitle, setJobTitle] = useState(
    initialJobPreference.profileTitle || ""
  );
  const [jobType, setJobType] = useState(initialJobPreference.jobType || "");
  const [locationSearch, setLocationSearch] = useState("");
  const [preferredJobLocation, setPreferredJobLocation] = useState(
    initialJobPreference?.preferredJobLocation || []
  );

  const { userid, token } = initialJobPreference;
  const userId = userid?.userid;
  const authToken = token?.token;

  if (!userId) {
    toast.error("User ID is missing");
    return;
  }

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
    const body = {
      profileTitle: values.profileTitle,
      jobType: values.jobType,
      preferredJobLocation: values.preferredJobLocation,
      // experienceYears: experienceYears,
      // experienceMonths: experienceMonths,
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
      }}
      validationSchema={validationJobPreference}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-6 w-full">
          {/* Profile Title */}
          <div>
            <label htmlFor="profileTitle" className="block text-sm font-medium">
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

          {/* Preferred Job Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
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
                  onClick={() => handleRemoveLocation(location, setFieldValue)}
                  className="text-red-500"
                >
                  <span className="text-xl">×</span>
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

          {/* Experience */}
          {/* <div className="block text-sm font-medium">
            <h1> Experience (in years)</h1>

            <div className="flex items-center gap-8 justify-between flex-col lg:flex-row">
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
          </div> */}

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium">Gender</label>
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

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium">
              Date of Birth
            </label>
            <Field
              type="date"
              name="dob"
              onChange={(e) => {
                const selectedDate = e.target.value;
                setFieldValue("dob", selectedDate);
              }}
              className="mt-1 p-3 w-full border rounded-md"
            />

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

          {/* Submit and Cancel Button */}
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
