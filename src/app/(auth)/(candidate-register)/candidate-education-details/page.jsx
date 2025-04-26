"use client";

import DegreeSearchBar from "@/components/graphql-ui/HighestQualificationDegree";
import { useSaveEducationalDetailsMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Configuration for dropdown options
const formOptions = {
  medium: [
    { value: "", label: "Please Select Medium" },
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
    { value: "Other", label: "Other" },
  ],
  boardOfEducation: [
    { value: "", label: "Please Select Board of Education" },
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
    { value: "CISCE", label: "CISCE" },
    { value: "NIOS", label: "NIOS" },
    { value: "CIE", label: "CIE" },
    { value: "IB", label: "IB" },
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
    { value: "Full Time", label: "Full Time" },
    { value: "Online/Distance", label: "Online/Distance" },
  ],
};

// Validation schema using Yup
const validationSchema = Yup.object({
  highestQualification: Yup.string().required(
    "Highest Qualification is required"
  ),
  medium: Yup.string().required("Medium is required"),
  boardOfEducation: Yup.string().required("Board of Education is required"),
  percentage: Yup.string().required("Percentage is required"),
  yearOfEducation: Yup.string().required("Year of Education is required"),
  educationMode: Yup.string().required("Please select an Education Mode"),
});

const initialValues = {
  candidateId: "",
  highestQualification: "",
  medium: "",
  boardOfEducation: "",
  percentage: "",
  yearOfEducation: "",
  educationMode: "",
};

const CandidateEducation = () => {
  const router = useRouter();
  const [saveEducationalDetails, { isLoading }] =
    useSaveEducationalDetailsMutation();
  const [degree, setDegree] = useState("");

  const { userid, token, role } = useSelector((state) => state.auth);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!token || role !== "candidate") {
      router.push("/");
    }
  }, [isClient, token, router, role]);

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
      const response = await saveEducationalDetails(body).unwrap();

      if (response.success) {
        toast.success(response.message);
        resetForm();
        router.push("/candidate-job-preference");
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-fit px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Continue"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CandidateEducation;
