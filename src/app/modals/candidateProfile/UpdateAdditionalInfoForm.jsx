import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateAdditionalInfo } from "../services/apiSlice"; // Your API call
import { additionalInfoValidationSchema } from "./constants/validationSchema"; // Assume you have a validation schema
import { Dropdown } from "./Dropdown"; // Importing the Dropdown component

const UpdateAdditionalInfoForm = ({ candidateId, initialData, closeModal }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(
        updateAdditionalInfo({
          candidateId,
          data: values,
        })
      ).unwrap();

      if (response.success) {
        toast.success(response.message);
        closeModal(); // Close the modal after successful update
      } else {
        toast.error(response.message || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating additional information:", error);
    }
  };

  const getInitialValues = () => ({
    noticePeriod: initialData?.noticePeriod || "",
    experience: {
      years: initialData?.experience?.years || "",
      months: initialData?.experience?.months || "",
    },
    currentSalary: initialData?.currentSalary || "",
    expectedSalary: initialData?.expectedSalary || "",
    terms: initialData?.terms || "",
    role: initialData?.role || "",
  });

  // Notice Period and Salary Options
 


  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={additionalInfoValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-4">
          {/* Notice Period - Using Dropdown */}
          <div>
            <label htmlFor="noticePeriod" className="text-sm font-medium">
              Notice Period (in months)
            </label>
            <Dropdown
              label="Notice Period"
              id="noticePeriod"
              value={values.noticePeriod}
              setValue={setFieldValue}
              options={noticePeriodOptions}
            />
          </div>

          {/* Experience */}
          <div className="flex space-x-4">
            <div>
              <label htmlFor="experience.years" className="text-sm font-medium">
                Years of Experience
              </label>
              <Field
                type="number"
                id="experience.years"
                name="experience.years"
                placeholder="Years"
                className="input-field"
              />
              <ErrorMessage
                name="experience.years"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="experience.months"
                className="text-sm font-medium"
              >
                Months of Experience
              </label>
              <Field
                type="number"
                id="experience.months"
                name="experience.months"
                placeholder="Months"
                className="input-field"
              />
              <ErrorMessage
                name="experience.months"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          {/* Current Salary - Using Dropdown */}
          <div>
            <label htmlFor="currentSalary" className="text-sm font-medium">
              Current Salary
            </label>
            <Dropdown
              label="Current Salary"
              id="currentSalary"
              value={values.currentSalary}
              setValue={setFieldValue}
              options={salaryOptions}
            />
          </div>

          {/* Expected Salary - Using Dropdown */}
          <div>
            <label htmlFor="expectedSalary" className="text-sm font-medium">
              Expected Salary
            </label>
            <Dropdown
              label="Expected Salary"
              id="expectedSalary"
              value={values.expectedSalary}
              setValue={setFieldValue}
              options={salaryOptions}
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Updating..." : "Update Additional Info"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateAdditionalInfoForm;
