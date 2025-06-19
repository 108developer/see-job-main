import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updatePersonalInfo } from "../services/apiSlice";
import LocationSearchBar from "./LocationSearchBar";
import RadioGroup from "./components/RadioGroup";
import { genderOption, maritalOption } from "./constants/constant";
import { personalInfoValidationSchema } from "./constants/validationSchema";

// Initial values for the form, including default empty values
const getInitialValues = (initialPersonalInfo) => ({
  fullName: initialPersonalInfo?.fullName || "",
  email: initialPersonalInfo?.email || "",
  phone: initialPersonalInfo?.phone || "",
  description: initialPersonalInfo?.description || "",
  currentLocation: initialPersonalInfo?.currentLocation || "",
  permanentAddress: initialPersonalInfo?.permanentAddress || "",
  gender: initialPersonalInfo?.gender || "",
  dob: initialPersonalInfo?.dob || "",
  age: initialPersonalInfo?.age || "",
  maritalStatus: initialPersonalInfo?.maritalStatus || "",
});

const UpdatePersonalInfoForm = ({ initialPersonalInfo, closeModal }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const response = await dispatch(
        updatePersonalInfo({
          candidateId: initialPersonalInfo?.id,
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
      console.error("Error updating personal info:", error);
    }
  };

  return (
    <Formik
      initialValues={getInitialValues(initialPersonalInfo)}
      validationSchema={personalInfoValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, touched, errors, setFieldValue }) => (
        <Form className="space-y-4">
          {/* Input Fields */}
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone", type: "text" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Age", name: "age", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label htmlFor={name}>{label}</label>
              <Field
                id={name}
                name={name}
                type={type}
                as={type === "textarea" ? "textarea" : "input"}
                className="input-field"
              />
              <ErrorMessage
                name={name}
                component="div"
                className="error-message"
              />
            </div>
          ))}

          {/* Current Location */}
          <div>
            <label
              htmlFor="currentLocation"
              className="block text-sm font-medium"
            >
              Current Location
            </label>
            <LocationSearchBar
              searchTerm={initialPersonalInfo?.currentLocation || ""}
              onSearchChange={(value) =>
                setFieldValue("currentLocation", value)
              }
              setFieldValue={setFieldValue}
              onLocationSelect={(selectedLocation) => {
                setFieldValue("currentLocation", selectedLocation.fullAddress);
              }}
              fieldName="currentLocation"
            />
            <ErrorMessage
              name="currentLocation"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Permanent Address */}
          <div>
            <label
              htmlFor="permanentAddress"
              className="block text-sm font-medium"
            >
              Permanent Address
            </label>
            <LocationSearchBar
              searchTerm={initialPersonalInfo?.permanentAddress || ""}
              onSearchChange={(value) =>
                setFieldValue("permanentAddress", value)
              }
              setFieldValue={setFieldValue}
              onLocationSelect={(selectedPermanentAddress) => {
                setFieldValue(
                  "permanentAddress",
                  selectedPermanentAddress.fullAddress
                );
              }}
              fieldName="permanentAddress"
            />
            <ErrorMessage
              name="permanentAddress"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Gender Field */}
          <RadioGroup label="Gender" name="gender" options={genderOption} />

          {/* Marital Status Field */}
          <RadioGroup
            label="Marital Status"
            name="maritalStatus"
            options={maritalOption}
          />

          <div className="mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              Update Info
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UpdatePersonalInfoForm;
