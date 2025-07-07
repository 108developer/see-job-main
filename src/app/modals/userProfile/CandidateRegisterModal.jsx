"use client";

import LocationSearchBar from "@/components/graphql-ui/LocationSearchBar";
import SkillDropdown from "@/components/graphql-ui/SkillsDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateRegisteredCandidateMutation } from "@/redux/api/candidateAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { validationRegisterForm } from "./validationSchemas";

const yearOptions = Array.from({ length: 16 }, (_, i) => i.toString());
const monthOptions = Array.from({ length: 12 }, (_, i) => i.toString());

const CandidateRegisterModal = ({ initialRegisterForm, closeModal }) => {
  const [location, setLocation] = useState(initialRegisterForm.location || "");
  // const [industry, setIndustry] = useState(initialRegisterForm.industry || "");
  const [monthExp, setMonthExp] = useState(initialRegisterForm.monthExp || 0);
  const [yearExp, setYearExp] = useState(initialRegisterForm.yearExp || 0);

  const [skillSet, setSkillSet] = useState("");

  const [updateRegisteredCandidate, { isLoading }] =
    useUpdateRegisteredCandidateMutation();

  const parseSkills = (skills) => {
    if (typeof skills === "string") {
      return skills.split(",").map((skill) => ({ name: skill.trim() }));
    }
    return skills || [];
  };

  const [selectedSkills, setSelectedSkills] = useState(
    parseSkills(initialRegisterForm.skills || [])
  );

  const { userid, token } = initialRegisterForm;
  const userId = userid?.userid;
  const authToken = token?.token;

  if (!userId) {
    toast.error("User ID is missing");
    return;
  }

  const skillsArray = selectedSkills.map((skill) =>
    typeof skill === "string" ? skill : skill.name
  );

  const handleRegister = async (values, { resetForm }) => {
    const body = {
      candidateId: userId,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      location: values.location,
      yearExp: values.yearExp,
      monthExp: values.monthExp,
      skills: skillsArray,
      // industry: values.industry,
      jobDescription: values.jobDescription,
    };

    try {
      const response = await updateRegisteredCandidate({
        userid: userId,
        token: authToken,
        registerData: body,
      }).unwrap();

      if (response.success) {
        toast.success(response.message);
        resetForm();
        closeModal();
        window.location.reload();
      } else {
        toast.error(response.message || "Update failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Update failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Formik
      initialValues={initialRegisterForm}
      validationSchema={validationRegisterForm}
      onSubmit={handleRegister}
      enableReinitialize
    >
      {({ setFieldValue }) => (
        <Form className="space-y-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl">Edit Candidate Details</h1>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className=" text-sm font-semibold">
              Full Name
            </label>
            <Field
              type="text"
              id="fullName"
              name="fullName"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="John Doe"
            />
            <ErrorMessage
              name="fullName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className=" text-sm font-semibold">
              Email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="sale@seejob.in"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className=" text-sm font-semibold">
              Phone
            </label>
            <div className="flex items-center">
              <div className="p-3 bg-gray-200 rounded-l-md border-2 border-gray-200">
                +91
              </div>
              <Field
                type="text"
                id="phone"
                name="phone"
                className="p-3 w-full border rounded-r-md"
                placeholder="10-digit Number"
              />
            </div>
            <ErrorMessage
              name="phone"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Experience */}
          <div className="w-full gap-2">
            <label className=" text-sm font-semibold mb-2">Experience</label>
            <div className="flex flex-col sm:flex-row gap-4 mt-1">
              {/* Years Select */}
              <div className="w-full sm:w-1/2">
                <Select
                  value={yearExp.toString()}
                  onValueChange={(val) => {
                    const year = parseInt(val);
                    setYearExp(year);
                    setFieldValue("yearExp", year);
                  }}
                >
                  <SelectTrigger className="w-full p-3 border rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Years" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year} year
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Months Select */}
              <div className="w-full sm:w-1/2">
                <Select
                  value={monthExp.toString()}
                  onValueChange={(val) => {
                    const month = parseInt(val);
                    setMonthExp(month);
                    setFieldValue("monthExp", month);
                  }}
                >
                  <SelectTrigger className="w-full p-3 border rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Months" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month} month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Current Location */}
          <div>
            <label htmlFor="location" className=" text-sm font-semibold">
              Current Location
            </label>
            <LocationSearchBar
              searchTerm={location}
              onSearchChange={(value) => setLocation(value)}
              setFieldValue={setFieldValue}
              onLocationSelect={(selectedLocation) => {
                setLocation(selectedLocation.fullAddress);
                setFieldValue("location", selectedLocation.fullAddress);
              }}
              fieldName="location"
            />
            <ErrorMessage
              name="location"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Key Skills */}
          <div>
            <label htmlFor="skills" className=" text-sm font-semibold">
              Key Skills*
            </label>
            <SkillDropdown
              searchTerm={skillSet}
              onSearchChange={(value) => setSkillSet(value)}
              setFieldValue={setFieldValue}
              selectedSkillsFromParent={selectedSkills}
              onSkillSelect={(selectedSkill) => {
                setSelectedSkills([...selectedSkills, selectedSkill]);
                setFieldValue("skills", [...selectedSkills, selectedSkill]);
              }}
              onRemoveSkill={(skillToRemove) => {
                const updatedSkills = selectedSkills.filter(
                  (skill) => skill !== skillToRemove
                );
                setSelectedSkills(updatedSkills);
                setFieldValue("skills", updatedSkills);
              }}
            />
            <ErrorMessage
              name="skills"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Preferred Industry */}
          {/* <div>
            <label htmlFor="industry" className=" text-sm font-semibold">
              Preferred Industry*
            </label>
            <IndustrySelectDropDown
              searchTerm={industry}
              onSearchChange={(value) => setIndustry(value)}
              setFieldValue={setFieldValue}
              onIndustrySelect={(selectedIndustry) => {
                setIndustry(selectedIndustry.name);
                setFieldValue("industry", selectedIndustry.name);
              }}
            />
            <ErrorMessage
              name="industry"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div> */}

          {/* Job Description */}
          <div>
            <label htmlFor="jobDescription" className=" text-sm font-semibold">
              Summary
            </label>
            <Field
              type="text"
              id="jobDescription"
              name="jobDescription"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Summary"
            />
            <ErrorMessage
              name="jobDescription"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Submit and Cancel Button */}
          <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4">
            <button
              type="button"
              className="w-fit px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-fit px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CandidateRegisterModal;
