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
  // city: Yup.string().required("City is required"),
  // zipCode: Yup.string().required("Zip Code is required"),
  // state: Yup.string().required("State is required"),
  // totalExperience: Yup.string().required("Total Experience is required"),
  // level: Yup.string().required("Level is required"),
  // industry: Yup.string().required("Industry is required"),
  // skills: Yup.array().min(5, "At least 5 skill is required"),
  // achievements: Yup.string(),
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
  monthExp: Yup.number()
    .min(0, "Month cannot be less than 0")
    .max(11, "Month cannot be more than 11")
    .required("Month is required"),
  yearExp: Yup.number()
    .min(0, "Year cannot be less than 0")
    .max(15, "Year cannot be more than 15")
    .required("Year is required"),
  skills: Yup.array().min(5, "At least 5 skill is required"),
  // industry: Yup.string().required("Preferred Industry is required"),
  jobDescription: Yup.string().required("Summary is required"),
});

export const validationJobPreference = Yup.object({
  profileTitle: Yup.string().required("Profile title is required"),
  jobType: Yup.array().min(1, "Select at least one job type"),
  preferredJobLocation: Yup.array()
    .min(1, "At least one location is required")
    .max(10, "You can select a maximum of 10 locations"),
  gender: Yup.string().required("Please select a gender"),
  dob: Yup.date()
    .required("Please select your date of birth")
    .max(new Date(), "Date of birth can't be in the future"),
  maritalStatus: Yup.string().required("Please select marital status"),
  language: Yup.array().min(1, "Select at least one language"),
  currentSalary: Yup.number()
    .required("Current salary is required")
    .min(0, "Salary cannot be negative")
    .typeError("Current salary must be a number"),
  expectedSalary: Yup.number()
    .required("Expected salary is required")
    .min(0, "Salary cannot be negative")
    .typeError("Expected salary must be a number"),
});

export const validationEducationDetails = Yup.object().shape({
  educationalEntries: Yup.array()
    .of(
      Yup.object().shape({
        educationLevel: Yup.string().required("Required"),
        highestQualification: Yup.string().when("educationLevel", {
          is: (val) => ["Diploma", "Bachelors", "Masters"].includes(val),
          then: Yup.string().required("Qualification is required"),
          otherwise: Yup.string().nullable(),
        }),
        boardOfEducation: Yup.string().when("educationLevel", {
          is: (val) => ["High School", "Intermediate"].includes(val),
          then: Yup.string().required("Board is required"),
          otherwise: Yup.string().nullable(),
        }),
        medium: Yup.string().when("educationLevel", {
          is: (val) => ["High School", "Intermediate"].includes(val),
          then: Yup.string().required("Medium is required"),
          otherwise: Yup.string().nullable(),
        }),
        percentage: Yup.number()
          .typeError("Must be a number")
          .required("Required")
          .min(0)
          .max(100),
        yearFrom: Yup.string().required("Required"),
        yearTo: Yup.string().required("Required"),
        educationMode: Yup.string().required("Required"),
      })
    )
    .min(1, "At least one education entry is required."),
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
  // noticePeriod: Yup.string().required("Notice Period is required"),
});
