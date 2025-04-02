"use client";

import JobTitleSearchBar from "@/components/graphql-ui/JobTitle";
import JobTypeSearchBar from "@/components/graphql-ui/JobType";
import { useUpdateJobPreferencesMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import moment from "moment";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { ExperienceDropdown } from "./ExperienceDropdown";
import { validationJobPreference } from "./validationSchemas";

const experienceOptions = Array.from({ length: 11 }, (_, i) => i);

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

const CandidateJobPreferences = ({ initialJobPreference, closeModal }) => {
  const [updateJobPreferences, { isLoading }] =
    useUpdateJobPreferencesMutation();
  const [experienceYears, setExperienceYears] = useState("");
  const [experienceMonths, setExperienceMonths] = useState("");
  const [jobTitle, setJobTitle] = useState(
    initialJobPreference.profileTitle || ""
  );
  const [jobType, setJobType] = useState(initialJobPreference.jobType || "");

  const [dobDisplay, setDobDisplay] = useState(
    initialJobPreference.dob
      ? moment(initialJobPreference.dob).format("DD/MM/YYYY")
      : ""
  );
  const { userid, token } = initialJobPreference;
  const userId = userid?.userid;
  const authToken = token?.token;

  if (!userId) {
    toast.error("User ID is missing");
    return;
  }

  const handleDobChange = (date) => {
    setDobDisplay(moment(date).format("DD/MM/YYYY"));
  };

  const handleSubmit = async (values, { resetForm }) => {
    const body = {
      profileTitle: values.profileTitle,
      jobType: values.jobType,
      experienceYears: experienceYears,
      experienceMonths: experienceMonths,
      gender: values.gender,
      dob: moment(dobDisplay, "DD/MM/YYYY"),
      maritalStatus: values.maritalStatus,
      language: values.language,
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
      initialValues={initialJobPreference}
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
                  selected={
                    dobDisplay
                      ? moment(dobDisplay, "DD/MM/YYYY").toDate()
                      : new Date()
                  }
                  onChange={(date) => {
                    setFieldValue("dob", moment(date));
                    handleDobChange(date);
                  }}
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
