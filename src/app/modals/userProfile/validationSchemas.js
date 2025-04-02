import * as Yup from "yup";

export const validationRegisterForm = Yup.object({
  location: Yup.string().required("Current Location is required"),
  minexp: Yup.number().required("Experience Min is required"),
  maxexp: Yup.number().required("Experience Max is required"),
  skills: Yup.array().min(1, "At least one skill is required"),
  industry: Yup.string().required("Preferred Industry is required"),
  file: Yup.mixed()
    .required("File is required")
    .test("fileSize", "File size is too large", (value) =>
      fileValidation(value, 5000000, ["application/pdf", "application/msword"])
    ),
  jobDescription: Yup.string().required("Job Description is required"),
  terms: Yup.boolean()
    .oneOf([true], "You must agree to the terms")
    .required("You must agree to the terms"),
});

export const validationJobPreference = Yup.object({
  profileTitle: Yup.string().required("Profile title is required"),
  jobType: Yup.string().required("Please select a job type"),
  experienceYears: Yup.number()
    .required("Experience in years is required")
    .min(0, "Experience cannot be negative"),
  experienceMonths: Yup.number()
    .required("Experience in months is required")
    .min(0, "Months cannot be negative")
    .max(12, "Months cannot exceed 12"),
  gender: Yup.string().required("Please select a gender"),
  dob: Yup.date().required("Please select your date of birth"),
  maritalStatus: Yup.string().required("Please select marital status"),
  language: Yup.string().required("Please select a language"),
});

export const validationEducationDetails = Yup.object({
  highestQualification: Yup.string().required(
    "Highest Qualification is required"
  ),
  medium: Yup.string().required("Medium is required"),
  boardOfEducation: Yup.string().required("Board of Education is required"),
  percentage: Yup.string().required("Percentage is required"),
  yearOfEducation: Yup.string().required("Year of Education is required"),
  educationMode: Yup.string().required("Please select an Education Mode"),
});
