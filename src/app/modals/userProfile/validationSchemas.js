import * as Yup from "yup";

// Validation schema using Yup
export const recruiterValidationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  mobileNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits")
    .required("Mobile Number is required"),
  location: Yup.string().required("Location is required"),
  companyName: Yup.string().required("Current Company Name is required"),
  designation: Yup.string().required("Current Designation is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("Zip Code is required"),
  state: Yup.string().required("State is required"),
  totalExperience: Yup.string().required("Total Experience is required"),
  level: Yup.string().required("Level is required"),
  // industry: Yup.string().required("Industry is required"),
  skills: Yup.array().min(1, "At least one skill is required"),
  achievements: Yup.string(),
  description: Yup.string(),
});

export const validationRegisterForm = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  location: Yup.string().required("Current Location is required"),
  minexp: Yup.number().required("Experience Min is required"),
  maxexp: Yup.number().required("Experience Max is required"),
  skills: Yup.array().min(1, "At least one skill is required"),
  // industry: Yup.string().required("Preferred Industry is required"),
  jobDescription: Yup.string().required("Job Description is required"),
});

export const validationJobPreference = Yup.object({
  profileTitle: Yup.string().required("Profile title is required"),
  jobType: Yup.string().required("Please select a job type"),
  preferredJobLocation: Yup.array()
    .min(1, "At least one location is required")
    .max(10, "You can select a maximum of 10 locations"),
  // experienceYears: Yup.number()
  //   .required("Experience in years is required")
  //   .min(0, "Experience cannot be negative"),
  // experienceMonths: Yup.number()
  //   .required("Experience in months is required")
  //   .min(0, "Months cannot be negative")
  //   .max(12, "Months cannot exceed 12"),
  gender: Yup.string().required("Please select a gender"),
  dob: Yup.date().required("Please select your date of birth"),
  maritalStatus: Yup.string().required("Please select marital status"),
  language: Yup.string().required("Please select a language"),
  currentSalary: Yup.number()
    .required("Current salary is required")
    .min(0, "Salary cannot be negative")
    .typeError("Current salary must be a number"),
  expectedSalary: Yup.number()
    .required("Expected salary is required")
    .min(0, "Salary cannot be negative")
    .typeError("Expected salary must be a number"),
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

export const validationWorkExperienceForm = Yup.object({
  companyName: Yup.string().required("Company Name is required"),
  jobTitle: Yup.string().required("Job Title is required"),
  startDate: Yup.date()
    .required("Start Date is required")
    .max(new Date(), "Start Date cannot be in the future"),
  // endDate: Yup.date().when("currentlyEmployed", {
  //   is: false,
  //   then: Yup.date()
  //     .required("End Date is required")
  //     .min(Yup.ref("startDate"), "End Date cannot be before Start Date"),
  //   otherwise: Yup.date().nullable(),
  // }),
  jobDescription: Yup.string()
    .required("Job Description is required")
    .max(1000, "Job Description must be at most 1000 characters"),
  location: Yup.string().required("Location is required"),
  // industry: Yup.string().required("Industry is required"),
  noticePeriod: Yup.string().required("Notice Period is required"),
});
