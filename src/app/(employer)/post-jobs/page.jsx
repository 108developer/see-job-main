"use client";

import JobRoleSearchBar from "@/components/graphql-ui/JobRole";
import JobTitleSearchBar from "@/components/graphql-ui/JobTitle";
import { GET_JOB_TYPES } from "@/graphql/queries/queriesFilter";
import { usePostJobMutation } from "@/redux/api/jobApi";
import { useQuery } from "@apollo/client";
import { City, Country, State } from "country-state-city";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Static Experience and Salary data
const experienceOptions = [
  { value: 0, label: "0 years" },
  { value: 1, label: "1 year" },
  { value: 2, label: "2 years" },
  { value: 3, label: "3 years" },
  { value: 4, label: "4 years" },
  { value: 5, label: "5 years" },
  { value: 6, label: "6 years" },
  { value: 7, label: "7 years" },
  { value: 8, label: "8 years" },
  { value: 9, label: "9 years" },
  { value: 10, label: "10+ years" },
];

const salaryOptions = [
  { value: 0, label: "0" },
  { value: 1, label: "10,000" },
  { value: 2, label: "20,000" },
  { value: 3, label: "30,000" },
  { value: 4, label: "40,000" },
  { value: 5, label: "50,000" },
  { value: 6, label: "60,000" },
  { value: 7, label: "70,000" },
  { value: 8, label: "80,000" },
  { value: 9, label: "90,000" },
  { value: 10, label: "100,000" },
  { value: 12, label: "120,000" },
  { value: 15, label: "150,000" },
];

// Validation Schema using Yup
const validationSchema = Yup.object({
  jobTitle: Yup.string().required("Job title is required"),
  jobType: Yup.array()
    .of(Yup.string().required("Job type is required"))
    .min(1, "At least one job type must be selected")
    .required("Job type is required"),
  jobRole: Yup.string().required("Job role is required"),
  minSalary: Yup.string().required("Min salary is required"),
  maxSalary: Yup.string().required("Max salary is required"),
  minExperience: Yup.string().required("Min experience is required"),
  maxExperience: Yup.string().required("Max experience is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  jobDescription: Yup.string().required("Job description is required"),
  hiringCompany: Yup.string().required("Hiring company is required"),
  contactEmail: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  contactPhone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be valid")
    .required("Phone number is required"),
  terms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

const initialValues = {
  jobTitle: "",
  jobType: [],
  jobRole: "",
  minSalary: "",
  maxSalary: "",
  minExperience: "",
  maxExperience: "",
  country: "",
  state: "",
  city: "",
  jobDescription: "",
  hiringCompany: "",
  contactEmail: "",
  contactPhone: "",
  terms: false,
};

const RangeSelector = ({ label, options, onSelect, value, unit }) => {
  return (
    <div className="flex items-center w-full">
      <div className="flex-1 bg-gray-300 border-[1px] border-gray-300 max-w-16 py-3 text-center rounded-l-md">
        <span>{label}</span>
      </div>

      <div className="flex-1 bg-white py-3 px-4 border-[1px] border-gray-300 rounded-r-md w-full">
        <select
          onChange={(e) => onSelect(e.target.value)}
          className="w-full bg-transparent outline-none"
          value={value}
        >
          <option value="">Select {label}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label} {unit && `(${unit})`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const PostJobs = () => {
  const router = useRouter();
  const [postJob, { isLoading }] = usePostJobMutation();
  const [experience, setExperience] = useState({ min: "", max: "" });
  const [salary, setSalary] = useState({ min: "", max: "" });
  const [jobDetails, setJobDetails] = useState({
    title: "",
    type: [],
    role: "",
    country: "",
    state: "",
    city: "",
    description: "",
    company: "",
    contactEmail: "",
    contactphone: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [availableJobtypes, setAvailableJobtypes] = useState([]);

  const { userid, token } = useSelector((state) => state.auth);

  const { data, loading, error } = useQuery(GET_JOB_TYPES);

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
    if (data && data.getJobTypes) {
      setAvailableJobtypes(data.getJobTypes);
    }
  }, [data, token, router]);

  const handleCountryClick = () => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  };

  const handleCountryChange = (e, setFieldValue) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]);
    setFieldValue("state", "");
    setFieldValue("city", "");
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setCities(City.getCitiesOfState(selectedCountry, stateCode));
  };

  const handleJobTypeChange = (e, setFieldValue) => {
    const { value, checked } = e.target;
    let updatedJobTypes = [...jobDetails.type];

    if (checked) {
      updatedJobTypes.push(value);
    } else {
      updatedJobTypes = updatedJobTypes.filter((item) => item !== value);
    }

    setJobDetails({ ...jobDetails, type: updatedJobTypes });
    setFieldValue("jobType", updatedJobTypes);
  };

  const handleSubmit = async (values, { resetForm }) => {
    const jobData = {
      employerId: userid,
      ...values,
    };
    try {
      console.log("Job Data", jobData);
      const response = await postJob(jobData).unwrap();
      if (response.success) {
        toast.success(response.message);
        resetForm();
        setJobDetails({
          title: "",
          type: [],
          role: "",
          country: "",
          state: "",
          city: "",
          description: "",
          company: "",
          contactEmail: "",
          contactphone: "",
        });
        setExperience({ min: "", max: "" });
        setSalary({ min: "", max: "" });
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div className="w-full py-6 px-28">
      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6 w-full">
            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium">
                Job Title
              </label>
              <JobTitleSearchBar
                searchTerm={jobDetails.title}
                onSearchChange={(value) =>
                  setJobDetails({ ...jobDetails, title: value })
                }
                setFieldValue={setFieldValue}
                onJobTitleSelect={(selectedJobTitle) => {
                  setJobDetails({
                    ...jobDetails,
                    title: selectedJobTitle.label,
                  });
                  setFieldValue("jobTitle", selectedJobTitle.label);
                }}
                placeholder="Sales, Executive, urgently..."
              />
              <ErrorMessage
                name="jobTitle"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Job Type (Multi-select checkbox) */}
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium">
                Job Type
              </label>
              <div className="flex flex-wrap gap-4 mt-2 w-full">
                {availableJobtypes.map((jobType) => (
                  <div key={jobType._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`jobType-${jobType._id}`}
                      name="jobType"
                      value={jobType.value}
                      onChange={(e) => handleJobTypeChange(e, setFieldValue)}
                      checked={jobDetails.type.includes(jobType.value)}
                      className="mr-2"
                    />

                    <label
                      htmlFor={`jobType-${jobType._id}`}
                      className="text-sm"
                    >
                      {jobType.label}
                    </label>
                  </div>
                ))}
              </div>
              <ErrorMessage
                name="jobType"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Job Role */}
            <div>
              <label htmlFor="jobRole" className="block text-sm font-medium">
                Job Role
              </label>
              <JobRoleSearchBar
                searchTerm={jobDetails.role}
                onSearchChange={(value) =>
                  setJobDetails({ ...jobDetails, role: value })
                }
                setFieldValue={setFieldValue}
                onJobRoleSelect={(selectedJobRole) => {
                  setJobDetails({
                    ...jobDetails,
                    role: selectedJobRole.label,
                  });
                  setFieldValue("role", selectedJobRole.label);
                }}
                placeholder="Dveloper, Designer, Manager..."
              />
              <ErrorMessage
                name="jobRole"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Experience Range */}
            <div className="block text-sm font-medium">
              <h1>Experience</h1>
              <div className="flex items-center gap-8 justify-between flex-col lg:flex-row">
                {/* Min Experience */}
                <RangeSelector
                  label="Min"
                  value={experience.min}
                  onSelect={(val) => {
                    setExperience({ ...experience, min: val });
                    setFieldValue("minExperience", val);
                  }}
                  options={experienceOptions.filter(
                    (opt) => opt.value <= (experience.max || 10)
                  )}
                />

                {/* Max Experience */}
                <RangeSelector
                  label="Max"
                  value={experience.max}
                  onSelect={(val) => {
                    setExperience({ ...experience, max: val });
                    setFieldValue("maxExperience", val);
                  }}
                  options={experienceOptions.filter(
                    (opt) => opt.value >= (experience.min || 0)
                  )}
                />
              </div>
            </div>

            {/* Salary Range */}
            <div className="block text-sm font-medium">
              <h1>Salary</h1>
              <div className="flex items-center gap-8 justify-between flex-col lg:flex-row">
                {/* Min Salary */}
                <RangeSelector
                  label="Min"
                  value={salary.min}
                  onSelect={(val) => {
                    setSalary({ ...salary, min: val });
                    setFieldValue("minSalary", val);
                  }}
                  options={salaryOptions.filter(
                    (opt) => opt.value <= (salary.max || 150000)
                  )}
                  unit="Rs/month"
                />

                {/* Max Salary */}
                <RangeSelector
                  label="Max"
                  value={salary.max}
                  onSelect={(val) => {
                    setSalary({ ...salary, max: val });
                    setFieldValue("maxSalary", val);
                  }}
                  options={salaryOptions.filter(
                    (opt) => opt.value >= (salary.min || 0)
                  )}
                  unit="Rs/month"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium">
                Country
              </label>
              <select
                name="country"
                onChange={(e) => {
                  setFieldValue("country", e.target.value);
                  handleCountryChange(e, setFieldValue);
                }}
                onClick={handleCountryClick}
                value={selectedCountry}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              <ErrorMessage
                name="country"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* State */}
            {selectedCountry && (
              <div>
                <label htmlFor="state" className="block text-sm font-medium">
                  State
                </label>
                <select
                  name="state"
                  onChange={(e) => {
                    setFieldValue("state", e.target.value);
                    handleStateChange(e);
                  }}
                  value={selectedState}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            {/* City */}
            {selectedState && (
              <div>
                <label htmlFor="city" className="block text-sm font-medium">
                  City
                </label>
                <select
                  name="city"
                  onChange={(e) => setFieldValue("city", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id || city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            {/* Job Description */}
            <div>
              <label
                htmlFor="jobDescription"
                className="block text-sm font-medium"
              >
                Job Description
              </label>
              <textarea
                name="jobDescription"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                onChange={(e) =>
                  setFieldValue("jobDescription", e.target.value)
                }
              />
              <ErrorMessage
                name="jobDescription"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <h1 className="text-xl font-bold space-y-4">
              Recruiter Details (cannot be changed)
            </h1>

            {/* Hiring Company */}
            <div>
              <label
                htmlFor="hiringCompany"
                className="block text-sm font-medium"
              >
                Hiring Company
              </label>
              <input
                type="text"
                name="hiringCompany"
                placeholder="Software Solution Pvt Ltd"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                onChange={(e) => setFieldValue("hiringCompany", e.target.value)}
              />
              <ErrorMessage
                name="hiringCompany"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex items-center justify-between w-full gap-8 flex-col md:flex-row">
              {/* Contact Email */}
              <div className="w-full">
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="Enter email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md"
                  onChange={(e) =>
                    setFieldValue("contactEmail", e.target.value)
                  }
                />
                <ErrorMessage
                  name="contactEmail"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Contact Phone */}
              <div className="w-full">
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium"
                >
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md"
                  placeholder="Enter phone number"
                  onChange={(e) =>
                    setFieldValue("contactPhone", e.target.value)
                  }
                />
                <ErrorMessage
                  name="contactPhone"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="inline-flex items-center">
                <Field type="checkbox" name="terms" className="form-checkbox" />
                <span className="ml-2 text-sm">
                  I agree to use the above details to create my Recruiter
                  Profile & display it on the SeeJob site and also agree to be
                  bound by the Terms of Use & Privacy of SeeJob.
                </span>
              </label>
              <ErrorMessage
                name="terms"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 mt-4 bg-red-600 text-white rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Post a job"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PostJobs;
