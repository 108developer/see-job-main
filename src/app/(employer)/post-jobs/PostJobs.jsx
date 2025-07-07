"use client";

import AddEditQuestionsModal from "@/app/(employer)/post-jobs/AddEditQuestionsModal";
import SEOModal from "@/app/modals/SEOModal";
import DegreeSearchBar from "@/components/graphql-ui/HighestQualificationDegree";
import JobTitleSearchBar from "@/components/graphql-ui/JobTitle";
import LocationSearchBar from "@/components/graphql-ui/LocationSearchBar";
import SkillDropdown from "@/components/graphql-ui/SkillsDropdown";
import AccessDenied from "@/components/ui/AccessDenied ";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePostJobMutation } from "@/redux/api/jobApi";
import { ErrorMessage, Field, Form, Formik } from "formik";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  experienceOptions,
  jobType,
  salaryOptions,
  validationSchema,
} from "./constants/constant";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image"],
];

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

const inputClass =
  "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

const PostJob = () => {
  const router = useRouter();
  const [postJob, { isLoading }] = usePostJobMutation();
  const { userid, token, role } = useSelector((state) => state.auth);

  const [isClient, setIsClient] = useState(false);

  const [description, setDescription] = useState("");

  const module = { toolbar: toolbarOptions };

  // useEffect(() => {
  //   if (token && role !== "employer" && role !== "recruiter") {
  //     router.push("/");
  //   }
  // }, [token, role, router]);

  const [location, setLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSet, setSkillSet] = useState("");
  const [experience, setExperience] = useState({ min: "", max: "" });
  const [salary, setSalary] = useState({ min: "", max: "" });
  const [jobTitle, setJobTitle] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [degree, setDegree] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("");

  const initialValues = {
    jobTitle: "",
    // jobRole: "",
    // category: "",
    skillsRequired: [],
    jobType: [],
    jobDescription: "",
    jobLocation: "",
    openings: 1,
    // deadline: "",
    // status: "open",
    monthlySalary: { min: "", max: "" },
    experience: { min: "", max: "" },
    degreeLevel: "any",
    education: "",
    questions: [],
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    companyDescription: "",
  };

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const openAddQuestionsModal = () => {
    setIsQuestionModalOpen(true);
  };

  const closeAddQuestionsModal = () => {
    setIsQuestionModalOpen(false);
  };

  const handleSubmit = async (values, { resetForm }) => {
    const { skillsRequired, location, highestQualification, ...cleanedValues } =
      values;

    const jobData = {
      userid,
      ...cleanedValues,
      questions,
    };

    try {
      const response = await postJob(jobData).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Job posted successfully!");
        router.push("/posted-jobs");
        resetForm();
      } else {
        toast.error(response?.message || "Failed to post job.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to post job.");
    }
  };

  return (
    <div className="w-full py-6 px-4 md:px-16 lg:px-28">
      {!(role === "employer" || role === "recruiter") ? (
        <div className="flex items-center justify-center w-full p-2">
          <AccessDenied title1={"employer"} title2={"recruiter"} />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-6">Post a New Job</h1>

          <SEOModal slug="post-jobs" />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6 w-full">
                {/* Basic Job Info */}
                <div>
                  <label htmlFor="jobTitle" className="text-sm font-semibold">
                    Job Title
                  </label>
                  <JobTitleSearchBar
                    searchTerm={jobTitle}
                    onSearchChange={(value) => setJobTitle(value)}
                    setFieldValue={setFieldValue}
                    onJobTitleSelect={(selectedJobTitle) => {
                      setJobTitle(selectedJobTitle.label);
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

                {/* Job Role */}
                {/* <div>
              <label htmlFor="jobRole" className="text-sm font-semibold">
                Job Role
              </label>
              <JobRoleSearchBar
                searchTerm={jobRole}
                onSearchChange={(value) => setJobRole(value)}
                setFieldValue={setFieldValue}
                onJobRoleSelect={(selectedJobRole) => {
                  setJobRole(selectedJobRole.label);
                  setFieldValue("jobRole", selectedJobRole.label);
                }}
                placeholder="Developer, Designer, Manager..."
              />

              <ErrorMessage
                name="jobRole"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div> */}

                {/* Category */}
                {/* <div>
              <label htmlFor="category" className="text-sm font-semibold">
                Category
              </label>
              <Field
                name="category"
                placeholder="IT, Finance, Healthcare"
                className={inputClass}
              />
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div> */}

                {/* Key Skills */}
                <div className="w-full mb-auto">
                  <label htmlFor="skills" className="text-sm font-semibold">
                    Key Skills
                  </label>
                  <SkillDropdown
                    searchTerm={skillSet}
                    onSearchChange={(value) => setSkillSet(value)}
                    setFieldValue={setFieldValue}
                    onSkillSelect={(selectedSkill) => {
                      setSelectedSkills([...selectedSkills, selectedSkill]);
                      setFieldValue("skillsRequired", [
                        ...selectedSkills,
                        selectedSkill,
                      ]);
                    }}
                    onRemoveSkill={(skillToRemove) => {
                      const updatedSkills = selectedSkills.filter(
                        (skill) => skill !== skillToRemove
                      );
                      setSelectedSkills(updatedSkills);
                      setFieldValue("skillsRequired", updatedSkills);
                    }}
                  />
                  <ErrorMessage
                    name="skillsRequired"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="degree" className="text-sm font-semibold">
                    Degree Level
                  </label>

                  <Select
                    onValueChange={(value) => {
                      setDegreeLevel(value);
                      setFieldValue("degreeLevel", value);
                    }}
                    defaultValue="any"
                  >
                    <SelectTrigger className="bg-white" id="degree">
                      <SelectValue
                        placeholder="Select Degree Level"
                        className="text-gray-400"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="10th">10th</SelectItem>
                      <SelectItem value="12th">12th</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelor">Bachelor's</SelectItem>
                      <SelectItem value="master">Master's</SelectItem>
                    </SelectContent>
                  </Select>

                  <ErrorMessage
                    name="degree"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Education */}
                <div>
                  <label htmlFor="education" className="text-sm font-semibold">
                    Education
                  </label>
                  <DegreeSearchBar
                    searchTerm={degree}
                    onSearchChange={(value) => setDegree(value)}
                    setFieldValue={setFieldValue}
                    onDegreeSelect={(selectedDegree) => {
                      setDegree(selectedDegree.label);
                      setFieldValue("education", selectedDegree.label);
                    }}
                  />
                  <ErrorMessage
                    name="education"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label htmlFor="jobType" className="text-sm font-semibold">
                    Job Type
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {jobType.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Field type="checkbox" name="jobType" value={type} />
                        {type}
                      </label>
                    ))}
                  </div>
                  <ErrorMessage
                    name="jobType"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label
                    htmlFor="jobDescription"
                    className="text-sm font-semibold"
                  >
                    Job Description
                  </label>
                  <div className="flex flex-col h-36 w-full overflow-auto">
                    <ReactQuill
                      className="w-full"
                      value={values.jobDescription}
                      onChange={(content) =>
                        setFieldValue("jobDescription", content)
                      }
                      modules={module}
                      theme="snow"
                      placeholder="Write your about here..."
                    />
                  </div>
                  <ErrorMessage
                    name="jobDescription"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Current Location */}
                <div>
                  <label
                    htmlFor="jobLocation"
                    className="text-sm font-semibold"
                  >
                    Office Location
                  </label>
                  <LocationSearchBar
                    searchTerm={location}
                    onSearchChange={(value) => setLocation(value)}
                    setFieldValue={setFieldValue}
                    onLocationSelect={(selectedLocation) => {
                      setLocation(selectedLocation.fullAddress);
                      setFieldValue(
                        "jobLocation",
                        selectedLocation.fullAddress
                      );
                    }}
                    fieldName="jobLocation"
                  />
                  <ErrorMessage
                    name="jobLocation"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Number of Openings */}
                <div>
                  <label htmlFor="openings" className="text-sm font-semibold">
                    Number of Openings
                  </label>
                  <Field
                    name="openings"
                    type="number"
                    placeholder="3"
                    className={inputClass}
                  />
                  <ErrorMessage
                    name="openings"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Application Deadline */}
                {/* <div>
                  <label htmlFor="deadline" className="text-sm font-semibold">
                    Application Deadline
                  </label>
                  <Field
                    name="deadline"
                    type="date"
                    className={inputClass}
                    placeholder="3"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <ErrorMessage
                    name="deadline"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div> */}

                {/* Status */}
                {/* <div>
              <label htmlFor="status" className="text-sm font-semibold">
                Status
              </label>
              <Field
                as="select"
                name="status"
                placeholder="3"
                className={inputClass}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="paused">Paused</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div> */}

                {/* Salary Range */}
                <div className="text-sm font-semibold">
                  <h1>
                    Salary{" "}
                    <span className="text-xs font-thin">(Per Month)</span>
                  </h1>
                  <div className="flex items-center gap-2 justify-between flex-col lg:flex-row font-medium">
                    {/* Min Salary */}
                    <RangeSelector
                      label="Min"
                      value={salary.min}
                      onSelect={(val) => {
                        setSalary({ ...salary, min: val });
                        setFieldValue("monthlySalary.min", val);
                      }}
                      options={salaryOptions
                        .filter((opt) => Number(opt) <= (salary.max || 150000))
                        .map((opt) => ({ value: opt, label: opt }))}
                    />

                    {/* Max Salary */}
                    <RangeSelector
                      label="Max"
                      value={salary.max}
                      onSelect={(val) => {
                        setSalary({ ...salary, max: val });
                        setFieldValue("monthlySalary.max", val);
                      }}
                      options={salaryOptions
                        .filter((opt) => Number(opt) >= (salary.min || 0))
                        .map((opt) => ({ value: opt, label: opt }))}
                    />
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <ErrorMessage
                      name="monthlySalary.min"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    <ErrorMessage
                      name="monthlySalary.max"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Experience Range */}
                <div className="text-sm font-semibold">
                  <h1>Experience</h1>
                  <div className="flex items-center gap-2 justify-between flex-col lg:flex-row font-medium">
                    {/* Min Experience */}
                    <RangeSelector
                      label="Min"
                      value={experience.min}
                      onSelect={(val) => {
                        setExperience({ ...experience, min: val });
                        setFieldValue("experience.min", val);
                      }}
                      options={experienceOptions
                        .filter((opt) => Number(opt) <= (experience.max || 15))
                        .map((opt) => ({ value: opt, label: opt }))}
                    />

                    {/* Max Experience */}
                    <RangeSelector
                      label="Max"
                      value={experience.max}
                      onSelect={(val) => {
                        setExperience({ ...experience, max: val });
                        setFieldValue("experience.max", val);
                      }}
                      options={experienceOptions
                        .filter((opt) => Number(opt) >= (experience.min || 0))
                        .map((opt) => ({ value: opt, label: opt }))}
                    />
                  </div>
                  <div className="flex items-center justify-between font-medium">
                    <ErrorMessage
                      name="experience.min"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    <ErrorMessage
                      name="experience.max"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label
                    htmlFor="companyName"
                    className="text-sm font-semibold"
                  >
                    Company Name
                  </label>
                  <Field
                    name="companyName"
                    placeholder="Google Inc."
                    className={inputClass}
                  />
                  <ErrorMessage
                    name="companyName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Company Email */}
                <div>
                  <label
                    htmlFor="companyEmail"
                    className="text-sm font-semibold"
                  >
                    Company Email
                  </label>
                  <Field
                    name="companyEmail"
                    type="email"
                    placeholder="careers@company.com"
                    className={inputClass}
                  />
                  <ErrorMessage
                    name="companyEmail"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Company Phone */}
                <div>
                  <label
                    htmlFor="companyPhone"
                    className="text-sm font-semibold"
                  >
                    Company Phone
                  </label>
                  <Field
                    name="companyPhone"
                    placeholder="+91 9876543210"
                    className={inputClass}
                  />
                  <ErrorMessage
                    name="companyPhone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Company Website */}
                <div>
                  <label
                    htmlFor="companyWebsite"
                    className="text-sm font-semibold"
                  >
                    Company Website
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    {/* <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
                      https://www.
                    </span> */}
                    <Field
                      name="companyWebsite"
                      placeholder="company.com"
                      className={inputClass}
                    />
                  </div>
                  <ErrorMessage
                    name="companyWebsite"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Company Description */}
                <div>
                  <label
                    htmlFor="companyDescription"
                    className="text-sm font-semibold"
                  >
                    Company Description
                  </label>
                  <Field
                    as="textarea"
                    name="companyDescription"
                    placeholder="Describe what your company does, mission, etc."
                    className={inputClass}
                    rows={3}
                  />
                  <ErrorMessage
                    name="companyDescription"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Application Questions */}
                <div>
                  <label
                    htmlFor="questions"
                    className="text-lg font-semibold mb-3 text-gray-800 flex items-center justify-between"
                  >
                    Application Questions
                    <button
                      type="button"
                      onClick={openAddQuestionsModal}
                      className="py-1 px-2 bg-indigo-600 text-sm text-white rounded-lg justify-end"
                    >
                      Add/Edit Questions
                    </button>
                  </label>
                  <div className="space-y-4">
                    {questions.map((q, index) => (
                      <div
                        key={index}
                        className="border p-6 rounded-lg shadow-md"
                      >
                        <div className="space-y-2">
                          <p>{`Que ${index + 1} - ${q.questionText}`}</p>
                          {q.type === "single-choice" && (
                            <div>
                              {q.options.map((option, i) => (
                                <label key={i} className="block">
                                  <input
                                    type="radio"
                                    name={`question${index}`}
                                  />{" "}
                                  {option}
                                </label>
                              ))}
                            </div>
                          )}
                          {q.type === "multiple-choice" && (
                            <div>
                              {q.options.map((option, i) => (
                                <label key={i} className="block">
                                  <input
                                    type="checkbox"
                                    name={`question${index}`}
                                  />{" "}
                                  {option}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Post Job  */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-3 mt-4 bg-red-600 text-white rounded-md"
                    disabled={isLoading}
                  >
                    {isLoading ? "Posting..." : "Post Job"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {isQuestionModalOpen && (
            <AddEditQuestionsModal
              closeModal={closeAddQuestionsModal}
              questions={questions}
              setQuestions={(updated) => {
                setQuestions(updated);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PostJob;
