import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateWorkExperience } from "../services/apiSlice"; // Import the update function
import RadioGroup from "./components/RadioGroup"; // For the radio buttons
import { workExperienceValidationSchema } from "./constants/validationSchema"; // Assuming you have a validation schema
import LocationSearchBar from "./LocationSearchBar"; // For location selection

const getInitialValues = () => ({
  companyName: initialWorkExperience?.companyName || "",
  jobTitle: initialWorkExperience?.jobTitle || "",
  startDate: initialWorkExperience?.startDate || "",
  endDate: initialWorkExperience?.endDate || "",
  currentlyEmployed: initialWorkExperience?.currentlyEmployed || false,
  jobDescription: initialWorkExperience?.jobDescription || "",
  industry: initialWorkExperience?.industry || "",
  location: initialWorkExperience?.location || "",
});

const UpdateWorkExperienceForm = ({ initialWorkExperience, closeModal }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(
        updateWorkExperience({
          candidateId,
          data: values,
          experienceId: initialWorkExperience._id,
        })
      ).unwrap();

      if (response.success) {
        toast.success(response.message);
        closeModal();
      } else {
        toast.error(response.message || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating work experience:", error);
    }
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={workExperienceValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-4">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="text-sm font-medium">
              Company Name
            </label>
            <Field
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Enter company name"
              className="input-field"
            />
            <ErrorMessage
              name="companyName"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Job Title */}
          <div>
            <label htmlFor="jobTitle" className="text-sm font-medium">
              Job Title
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
              className="text-red-500 text-sm"
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </label>
            <Field
              type="date"
              id="startDate"
              name="startDate"
              className="input-field"
            />
            <ErrorMessage
              name="startDate"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="text-sm font-medium">
              End Date
            </label>
            <Field
              type="date"
              id="endDate"
              name="endDate"
              className="input-field"
            />
            <ErrorMessage
              name="endDate"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Currently Employed */}
          <div>
            <label className="text-sm font-medium">Currently Employed?</label>
            <RadioGroup
              name="currentlyEmployed"
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
            />
            <ErrorMessage
              name="currentlyEmployed"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="jobDescription" className="text-sm font-medium">
              Job Description
            </label>
            <Field
              as="textarea"
              id="jobDescription"
              name="jobDescription"
              placeholder="Describe your job"
              className="input-field"
            />
            <ErrorMessage
              name="jobDescription"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="text-sm font-medium">
              Industry
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
              name="industry"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <LocationSearchBar
              searchTerm={values.location}
              onSearchChange={(value) => setFieldValue("location", value)}
              onLocationSelect={(selectedLocation) =>
                setFieldValue("location", selectedLocation.fullAddress)
              }
            />
            <ErrorMessage
              name="location"
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
              {isSubmitting ? "Updating..." : "Update Work Experience"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateWorkExperienceForm;
