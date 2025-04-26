import * as Yup from "yup";

// Validation schema using Yup
export const personalInfoValidationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  description: Yup.string(),
  currentLocation: Yup.string().required("Current location is required"),
  permanentAddress: Yup.string().required("Permanent address is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.date(),
  age: Yup.number(),
  maritalStatus: Yup.string().required("Marital status is required"),
});

export const jobPreferencesValidationSchema = Yup.object({
  jobTitle: Yup.string().required("Job Title is required"),
  jobRoles: Yup.string()
    .required("Job Role is required")
    .min(1, "Job Role must be at least 2 characters"),
  jobType: Yup.string().required("Job Type is required"),
  jobIndustry: Yup.string().required("Preferred Industry is required"),
  jobLocation: Yup.array()
    .of(Yup.string().required("preferred Location is required"))
    .min(1, "At least one preferred job location is required"),
});

// Education Validation Schema
export const educationValidationSchema = Yup.object({
  degree: Yup.string()
    .required("Degree is required")
    .notOneOf(["Please Select Degree"], "Please select a valid degree"),
  medium: Yup.string()
    .required("Medium is required")
    .notOneOf(["Please Select Medium"], "Please select a valid medium"),
  board: Yup.string()
    .required("Board of Education is required")
    .notOneOf(
      ["Please Select Board of Education"],
      "Please select a valid board"
    ),
  percentage: Yup.string()
    .required("Percentage is required")
    .notOneOf(["Select Percentage"], "Please select a valid percentage range"),
  startYear: Yup.number()
    .required("Start Year is required")
    .min(1900, "Year must be greater than or equal to 1900")
    .max(new Date().getFullYear(), "Start year cannot be in the future"),
  passoutYear: Yup.number()
    .required("Passout Year is required")
    .min(1900, "Year must be greater than or equal to 1900")
    .max(new Date().getFullYear(), "Passout year cannot be in the future")
    .test(
      "is-passout-year-after-start-year",
      "Passout year must be after start year",
      function (value) {
        const { startYear } = this.parent;
        return value >= startYear;
      }
    ),

  mode: Yup.string().required("Mode of education is required"),
});
