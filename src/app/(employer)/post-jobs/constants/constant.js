import * as Yup from "yup";

export const jobType = [
  "Full Time",
  "Freelance",
  "Internship",
  "Work From Home",
  "On Site",
  "Hybrid",
];

export const experienceOptions = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

export const salaryOptions = [
  "5000",
  "10000",
  "15000",
  "20000",
  "25000",
  "30000",
  "35000",
  "40000",
  "45000",
  "50000",
  "55000",
  "60000",
  "65000",
  "70000",
  "75000",
  "80000",
  "85000",
  "90000",
  "95000",
  "100000",
  "105000",
  "110000",
  "115000",
  "120000",
  "125000",
  "150000",
  "155000",
];

// Validation Schema using Yup
export const validationSchema = Yup.object({
  jobTitle: Yup.string().required("Job title is required"),
  jobRole: Yup.string().required("Job role is required"),
  category: Yup.string().required("Category is required"),
  jobType: Yup.array()
    .of(Yup.string().required("Job type is required"))
    .min(1, "At least one job type must be selected")
    .required("Job type is required"),
  jobDescription: Yup.string().required("Job description is required"),
  jobLocation: Yup.string().required("Job location is required"),
  openings: Yup.number()
    .min(1, "At least one opening is required")
    .required("Openings are required"),
  deadline: Yup.date().required("Deadline is required"),
  status: Yup.string()
    .oneOf(["open", "closed"], "Invalid status")
    .required("Status is required"),
  monthlySalary: Yup.object({
    min: Yup.string().required("Min salary is required"),
    max: Yup.string().required("Max salary is required"),
  }),
  experience: Yup.object({
    min: Yup.string().required("Min experience is required"),
    max: Yup.string().required("Max experience is required"),
  }),
  education: Yup.string().required("Education is required"),
  skillsRequired: Yup.array().min(1, "At least one skill is required"),
  companyName: Yup.string().required("Company name is required"),
  companyEmail: Yup.string()
    .email("Invalid email format")
    .required("Company email is required"),
  companyPhone: Yup.string().required("Company phone is required"),
  companyWebsite: Yup.string()
    .url("Invalid website URL format")
    .required("Company website is required"),
  companyDescription: Yup.string().required("Company description is required"),
});
