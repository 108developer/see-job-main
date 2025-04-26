import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateLanguages } from "../services/apiSlice"; // Import API call
import { languageValidationSchema } from "./constants/validationSchema"; // Validation schema
import { Dropdown } from "./Dropdown"; // Import Dropdown component

const UpdateLanguagesForm = ({ candidateId, initialData, closeModal }) => {
  const dispatch = useDispatch();

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(
        updateLanguages({
          candidateId,
          data: values,
        })
      ).unwrap();

      if (response.success) {
        toast.success(response.message);
        closeModal(); // Close modal on success
      } else {
        toast.error(response.message || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating language information:", error);
    }
  };

  // Initial values for the form
  const getInitialValues = () => ({
    languageName: initialData?.languageName || "",
    proficiency: initialData?.proficiency || "",
  });

  // Proficiency options for dropdown
  const proficiencyOptions = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Fluent",
    "Native",
  ];

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={languageValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-4">
          {/* Language Name */}
          <div>
            <label htmlFor="languageName" className="text-sm font-medium">
              Language Name
            </label>
            <Field
              type="text"
              id="languageName"
              name="languageName"
              placeholder="Enter language name"
              className="input-field"
            />
            <ErrorMessage
              name="languageName"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Proficiency Level */}
          <div>
            <label htmlFor="proficiency" className="text-sm font-medium">
              Proficiency Level
            </label>
            <Dropdown
              label="Proficiency Level"
              id="proficiency"
              value={values.proficiency}
              setValue={setFieldValue}
              options={proficiencyOptions}
            />
            <ErrorMessage
              name="proficiency"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Updating..." : "Update Language"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateLanguagesForm;
