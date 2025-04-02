"use client";

import DegreeSearchBar from "@/components/graphql-ui/HighestQualificationDegree";
import { useUpdateEducationalDetailsMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { validationEducationDetails } from "./validationSchemas";

const formOptions = {
  medium: [
    { value: "", label: "Please Select Medium" },
    { value: "hindi", label: "Hindi" },
    { value: "english", label: "English" },
    { value: "other", label: "Other" },
  ],
  boardOfEducation: [
    { value: "", label: "Please Select Board of Education" },
    { value: "cbse", label: "CBSE" },
    { value: "icse", label: "ICSE" },
    { value: "cisce", label: "CISCE" },
    { value: "nios", label: "NIOS" },
    { value: "cie", label: "CIE" },
    { value: "ib", label: "IB" },
  ],
  percentage: [
    { value: "", label: "Select Percentage" },
    { value: "0-40", label: "Below 40%" },
    { value: "40-50", label: "40% - 50%" },
    { value: "50-60", label: "50% - 60%" },
    { value: "60-70", label: "60% - 70%" },
    { value: "70-80", label: "70% - 80%" },
    { value: "80-90", label: "80% - 90%" },
    { value: "90-100", label: "90% - 100%" },
  ],
  educationMode: [
    { value: "fullTime", label: "Full Time" },
    { value: "partTime", label: "Part Time" },
    { value: "correspondence", label: "Correspondence" },
  ],
};

const CandidateEducation = ({ initialEducationDetails, closeModal }) => {
  const [updateEducationalDetails, { isLoading }] =
    useUpdateEducationalDetailsMutation();
  const [degree, setDegree] = useState(
    initialEducationDetails.highestQualification || ""
  );

  const { userid, token } = initialEducationDetails;
  const userId = userid?.userid;
  const authToken = token?.token;

  if (!userId) {
    toast.error("User ID is missing");
    return;
  }

  const handleRegister = async (values, { resetForm }) => {
    const body = {
      candidateId: userid,
      highestQualification: values.highestQualification,
      medium: values.medium,
      boardOfEducation: values.boardOfEducation,
      percentage: values.percentage,
      yearOfEducation: values.yearOfEducation,
      educationMode: values.educationMode,
    };

    try {
      const response = await updateEducationalDetails({
        userid: userId,
        token: authToken,
        educationData: body,
      }).unwrap();

      if (response.success) {
        toast.success(response.message);
        resetForm();
        closeModal();
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
    <Formik
      initialValues={initialEducationDetails}
      validationSchema={validationEducationDetails}
      onSubmit={handleRegister}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-6 w-full">
          {/* Highest Qualification */}
          <div>
            <label
              htmlFor="highestQualification"
              className="block text-sm font-medium"
            >
              Highest Qualification
            </label>

            <DegreeSearchBar
              searchTerm={degree}
              onSearchChange={(value) => setDegree(value)}
              setFieldValue={setFieldValue}
              onDegreeSelect={(selectedDegree) => {
                setDegree(selectedDegree.label);
                setFieldValue("highestQualification", selectedDegree.label);
              }}
            />
            <ErrorMessage
              name="highestQualification"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Medium */}
          <div>
            <label htmlFor="medium" className="block text-sm font-medium">
              Medium
            </label>
            <Field
              as="select"
              id="medium"
              name="medium"
              className="mt-1 p-3 w-full border rounded-md"
            >
              {formOptions.medium.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="medium"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Board of Education */}
          <div>
            <label
              htmlFor="boardOfEducation"
              className="block text-sm font-medium"
            >
              Board of Education
            </label>
            <Field
              as="select"
              id="boardOfEducation"
              name="boardOfEducation"
              className="mt-1 p-3 w-full border rounded-md"
            >
              {formOptions.boardOfEducation.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="boardOfEducation"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Percentage */}
          <div>
            <label htmlFor="percentage" className="block text-sm font-medium">
              Percentage
            </label>
            <Field
              as="select"
              id="percentage"
              name="percentage"
              className="mt-1 p-3 w-full border rounded-md"
            >
              {formOptions.percentage.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="percentage"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Year of Education */}
          <div>
            <label
              htmlFor="yearOfEducation"
              className="block text-sm font-medium"
            >
              Year of Education
            </label>
            <Field
              type="text"
              id="yearOfEducation"
              name="yearOfEducation"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Year of Education"
            />
            <ErrorMessage
              name="yearOfEducation"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Education Mode */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Education Mode
            </label>
            <div className="space-x-4 flex">
              {formOptions.educationMode.map((option) => (
                <div key={option.value} className="flex">
                  <Field
                    type="radio"
                    id={option.value}
                    name="educationMode"
                    value={option.value}
                    className="mr-2"
                  />
                  <label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            <ErrorMessage
              name="educationMode"
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

export default CandidateEducation;
