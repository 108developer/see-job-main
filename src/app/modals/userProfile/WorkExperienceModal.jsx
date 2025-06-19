"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { validationWorkExperienceForm } from "./validationSchemas";
import {
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
} from "@/redux/api/candidateAuth";
import LocationSearchBar from "@/components/graphql-ui/LocationSearchBar";
// import IndustrySelectDropDown from "@/components/graphql-ui/IndustrySelectDropDown";
import { useSelector } from "react-redux";

const formatDate = (date) => {
  if (!date) return "";
  return date.split("T")[0];
};

const WorkExperienceModal = ({ experience = null, closeModal }) => {
  const isEdit = Boolean(experience);
  const { userid } = useSelector((state) => state.auth);

  const [location, setLocation] = useState(experience?.location || "");
  // const [industry, setIndustry] = useState(experience?.industry || "");

  const [addWorkExperience, { isLoading: isAdding }] =
    useAddWorkExperienceMutation();
  const [updateWorkExperience, { isLoading: isUpdating }] =
    useUpdateWorkExperienceMutation();

  const initialValues = {
    companyName: experience?.companyName || "",
    jobTitle: experience?.jobTitle || "",
    startDate: formatDate(experience?.startDate),
    endDate: experience?.endDate ? formatDate(experience?.endDate) : "",
    currentlyEmployed: experience?.currentlyEmployed || true,
    jobDescription: experience?.jobDescription || "",
    location: experience?.location || "",
    // industry: experience?.industry || "",
    noticePeriod: experience?.noticePeriod || "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const body = {
        ...values,
        location,
        // industry,
      };

      if (isEdit) {
        body.experienceId = experience._id;
        await updateWorkExperience({
          userid,
          updatedExperienceData: body,
        }).unwrap();
        toast.success("Work experience updated successfully.");
      } else {
        await addWorkExperience({
          userid,
          workExperienceData: body,
        }).unwrap();
        toast.success("Work experience added successfully.");
      }

      resetForm();
      closeModal();
    } catch (error) {
      const errMsg =
        error?.data?.message || error?.message || "Failed to save experience.";
      toast.error(errMsg);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationWorkExperienceForm}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
        <Form className="space-y-6 w-full">
          <h1 className="text-xl">
            {isEdit ? "Edit Work Experience" : "Add Work Experience"}
          </h1>

          <div>
            <label className="text-sm font-semibold">Company Name</label>
            <Field
              type="text"
              name="companyName"
              placeholder="e.g. Google"
              className="mt-1 p-3 w-full border rounded-md"
            />
            <ErrorMessage
              name="companyName"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Job Title</label>
            <Field
              type="text"
              name="jobTitle"
              placeholder="e.g. Software Engineer"
              className="mt-1 p-3 w-full border rounded-md"
            />
            <ErrorMessage
              name="jobTitle"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex gap-4 flex-col md:flex-row">
            <div className="w-full">
              <label className="text-sm font-semibold">Start Date</label>
              <Field
                type="date"
                name="startDate"
                className="mt-1 p-3 w-full border rounded-md"
              />
              <ErrorMessage
                name="startDate"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="w-full">
              <label className="text-sm font-semibold">End Date</label>
              <Field
                type="date"
                name="endDate"
                disabled={values.currentlyEmployed}
                className="mt-1 p-3 w-full border rounded-md"
              />
              <ErrorMessage
                name="endDate"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Field type="checkbox" name="currentlyEmployed" />
            <label className="text-sm">Currently Employed</label>
          </div>

          <div>
            <label className="text-sm font-semibold">Job Description</label>
            <Field
              as="textarea"
              name="jobDescription"
              placeholder="Describe your role and responsibilities"
              className="mt-1 p-3 w-full border rounded-md"
              rows="4"
            />
            <ErrorMessage
              name="jobDescription"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Location</label>
            <LocationSearchBar
              searchTerm={location}
              setFieldValue={setFieldValue}
              onSearchChange={setLocation}
              onLocationSelect={(loc) => {
                setLocation(loc.fullAddress);
                setFieldValue("location", loc.fullAddress);
              }}
              fieldName="location"
            />
            <ErrorMessage
              name="location"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* <div>
            <label className="text-sm font-semibold">Industry</label>
            <IndustrySelectDropDown
              searchTerm={industry}
              setFieldValue={setFieldValue}
              onSearchChange={setIndustry}
              onIndustrySelect={(ind) => {
                setIndustry(ind.name);
                setFieldValue("industry", ind.name);
              }}
            />
            <ErrorMessage
              name="industry"
              component="div"
              className="text-red-500 text-sm"
            />
          </div> */}

          <div>
            <label className="text-sm font-semibold">Notice Period</label>
            <Field
              as="select"
              name="noticePeriod"
              className="mt-1 p-3 w-full border rounded-md"
            >
              <option value="">Select</option>
              {[
                "Immediate",
                "30 Days",
                "45 Days",
                "60 Days",
                "75 Days",
                "90 Days",
              ].map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="noticePeriod"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isAdding || isUpdating}
            >
              {isAdding || isUpdating ? "Saving..." : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default WorkExperienceModal;
