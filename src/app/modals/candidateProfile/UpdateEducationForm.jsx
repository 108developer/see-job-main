import { ErrorMessage, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateEducationDetails } from "../services/apiSlice"; // Import API update function
import {
  boardOptions,
  mediumOptions,
  modeOptions,
  percentageOptions,
} from "./constants/constant";
import { educationValidationSchema } from "./constants/validationSchema";
import DegreeSearchBar from "@/components/graphql-ui/HighestQualificationDegree";
import Dropdown from "./Dropdown";
import RadioGroup from "./RadioGroup";

// Initial values for the form, including default empty values
const getInitialValues = (initialEducationDetails) => ({
  degree: initialEducationDetails?.degree || "",
  medium: initialEducationDetails?.medium || "",
  board: initialEducationDetails?.board || "",
  percentage: initialEducationDetails?.percentage || "",
  startYear: initialEducationDetails?.startYear || "",
  passoutYear: initialEducationDetails?.passoutYear || "",
  mode: initialEducationDetails?.mode || "",
});

const UpdateEducationForm = ({ initialEducationDetails, closeModal }) => {
  const [degree, setDegree] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(
        updateEducationDetails({
          candidateId: initialEducationDetails?.candidateId,
          educationId: initialEducationDetails?.educationId,
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
      console.error("Error updating education details:", error);
    }
  };

  return (
    <Formik
      initialValues={getInitialValues(initialEducationDetails)}
      validationSchema={educationValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-4">
          {/* Degree (Custom component) */}
          <div>
            <label htmlFor="degree" className="text-sm font-medium">
              Degree
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
              name="degree"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Medium Dropdown */}
          <Dropdown
            label="Medium"
            id="medium"
            value={values.medium}
            setValue={setFieldValue}
            options={mediumOptions}
          />

          {/* Board of Education Dropdown */}
          <Dropdown
            label="Board of Education"
            id="board"
            value={values.board}
            setValue={setFieldValue}
            options={boardOptions}
          />

          {/* Percentage Dropdown */}
          <Dropdown
            label="Percentage"
            id="percentage"
            value={values.percentage}
            setValue={setFieldValue}
            options={percentageOptions}
          />

          {/* Start Year Dropdown */}
          <Dropdown
            label="Start Year"
            id="startYear"
            value={values.startYear}
            setValue={setFieldValue}
            options={Array.from({ length: 100 }, (_, i) => 2025 - i)} // Example array for years
          />

          {/* Passout Year Dropdown */}
          <Dropdown
            label="Passout Year"
            id="passoutYear"
            value={values.passoutYear}
            setValue={setFieldValue}
            options={Array.from({ length: 100 }, (_, i) => 2025 - i)} // Example array for years
          />

          {/* Education Mode Radio Group */}
          <RadioGroup
            label="Education Mode"
            name="mode"
            options={modeOptions.map((mode) => ({
              label: mode,
              value: mode,
            }))}
          />

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? "Updating..." : "Update Education Details"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateEducationForm;
