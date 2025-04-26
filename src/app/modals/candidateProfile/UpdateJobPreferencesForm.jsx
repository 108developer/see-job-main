import { ErrorMessage, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateJobPreferences } from "../services/apiSlice"; // Import API update function
import LocationSearchBar from "./LocationSearchBar";
import RadioGroup from "./components/RadioGroup";
import { jobTypeOptions } from "./constants/constant"; // assuming you have these constants
import { jobPreferencesValidationSchema } from "./constants/validationSchema"; // Assuming you've created a validation schema

// Initial values for the form, including default empty values
const getInitialValues = (initialJobPreferences) => ({
  jobTitle: initialJobPreferences?.jobTitle || "",
  jobRoles: initialJobPreferences?.jobRoles || [],
  jobType: initialJobPreferences?.jobType || "",
  jobIndustry: initialJobPreferences?.jobIndustry || "",
  jobLocation: initialJobPreferences?.jobLocation || [],
});

const UpdateJobPreferencesForm = ({ initialJobPreferences, closeModal }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(
        updateJobPreferences({
          candidateId: initialJobPreferences?.candidateId,
          data: values,
        })
      ).unwrap();

      if (response.success) {
        toast.success(response.message);
        closeModal();
      } else {
        toast.error(response.message || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating job preferences:", error);
    }
  };

  return (
    <Formik
      initialValues={getInitialValues(initialJobPreferences)}
      validationSchema={jobPreferencesValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, touched, errors, setFieldValue, values }) => (
        <Form className="space-y-4">
          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="text-sm font-medium">
              Profile Title
            </label>
            <JobTitleSearchBar
              searchTerm={values.jobTitle}
              onSearchChange={(value) => setFieldValue("jobTitle", value)}
              setFieldValue={setFieldValue}
              onJobTitleSelect={(selectedJobTitle) => {
                setFieldValue("jobTitle", selectedJobTitle.label);
              }}
            />
            <ErrorMessage
              name="jobTitle"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Job Role */}
          <div>
            <label htmlFor="jobRoles" className="text-sm font-semibold">
              Job Role
            </label>
            <JobRoleSearchBar
              searchTerm={values.jobRoles}
              onSearchChange={(value) => setFieldValue("jobRoles", value)}
              setFieldValue={setFieldValue}
              onJobRoleSelect={(selectedJobRole) => {
                setFieldValue("jobRoles", selectedJobRole.label);
              }}
              placeholder="Developer, Designer, Manager..."
            />
            <ErrorMessage
              name="jobRoles"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Job Type */}
          <RadioGroup
            label="Job Type"
            name="jobType"
            options={jobTypeOptions}
          />

          {/* Preferred Industry */}
          <div className="w-full mb-auto">
            <label htmlFor="jobIndustry" className="block text-sm font-medium">
              Preferred Industry*
            </label>
            <IndustrySelectDropDown
              searchTerm={values.jobIndustry}
              onSearchChange={(value) => setFieldValue("jobIndustry", value)}
              setFieldValue={setFieldValue}
              onIndustrySelect={(selectedIndustry) => {
                setFieldValue("jobIndustry", selectedIndustry.name);
              }}
            />
            <ErrorMessage
              name="jobIndustry"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Preferred Job Locations */}
          <div>
            <label htmlFor="jobLocation" className="text-sm font-medium">
              Preferred Job Locations
            </label>
            <LocationSearchBar
              searchTerm={values.jobLocation.join(", ")} // Show locations as comma-separated
              onSearchChange={(value) => {
                // Update the locations as array
                setFieldValue(
                  "jobLocation",
                  value.split(", ").map((loc) => loc.trim())
                );
              }}
              setFieldValue={setFieldValue}
              onLocationSelect={(selectedLocation) => {
                setFieldValue("jobLocation", [
                  ...values.jobLocation,
                  selectedLocation.fullAddress,
                ]);
              }}
            />
            <ErrorMessage
              name="jobLocation"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Display selected locations with a cross sign */}
          <div className="flex flex-wrap gap-2">
            {values.jobLocation.map((location, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-200 p-2 rounded-md"
              >
                <span>{location}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newLocations = values.jobLocation.filter(
                      (loc) => loc !== location
                    );
                    setFieldValue("jobLocation", newLocations);
                  }}
                  className="text-red-500"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              Update Job Preferences
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateJobPreferencesForm;
