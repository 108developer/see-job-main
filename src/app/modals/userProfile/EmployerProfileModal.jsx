"use client";

import CityStateCountrySearchBar from "@/components/graphql-ui/CityStateCountrySearchBar";
import { useUpdateRecruiterMutation } from "@/redux/api/employerAuth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { recruiterValidationSchema } from "./validationSchemas";

const RecruiterProfile = ({ employerData, closeModal }) => {
  const [location, setLocation] = useState(employerData.location || "");
  // const [industry, setIndustry] = useState(employerData.industry || "");
  const [skillSet, setSkillSet] = useState("");

  const [updateRecruiter, { isLoading }] = useUpdateRecruiterMutation();

  const parseSkills = (skills) => {
    if (typeof skills === "string") {
      return skills.split(",").map((skill) => ({ name: skill.trim() }));
    }
    return skills || [];
  };

  const [selectedSkills, setSelectedSkills] = useState(
    parseSkills(employerData.skills || [])
  );

  const { userid, token } = employerData;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobileNumber: values.mobileNumber,
        location: values.location,
        // skills: selectedSkills.map((skill) => skill?.name || skill),
        companyName: values.companyName,
        designation: values.designation,
        address: values.address,
        // city: values.city,
        // zipCode: values.zipCode,
        // state: values.state,
        // totalExperience: values.totalExperience,
        // level: values.level,
        // industry: values.industry,
        // achievements: values.achievements,
        description: values.description,
      };

      const response = await updateRecruiter({
        userid,
        token,
        userData: formData,
      });

      if (response?.data?.success) {
        resetForm();
        closeModal();
        toast.success(response?.data?.message);
        window.location.reload();
      } else {
        toast.error(
          response?.data?.message || "Registration failed. Please try again."
        );
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
      initialValues={employerData}
      validationSchema={recruiterValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl">Edit Recruiter Details</h1>
          </div>
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name
            </label>
            <Field
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="First Name"
            />
            <ErrorMessage
              name="firstName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium">
              Last Name
            </label>
            <Field
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Last Name"
            />
            <ErrorMessage
              name="lastName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Field
              type="email"
              id="email"
              name="email"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium">
              Phone
            </label>
            <Field
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Mobile Number"
            />
            <ErrorMessage
              name="mobileNumber"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Key Skills */}
          {/* <div className="w-full mb-auto">
            <label htmlFor="skills" className="block text-sm font-medium">
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
              onRemoveSkill={(selectedSkill) => {
                const updatedSkills = selectedSkills.filter(
                  (skill) => skill !== selectedSkill
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
          </div> */}

          {/* Current Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium">
              Company Name
            </label>
            <Field
              type="text"
              id="companyName"
              name="companyName"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Current Company Name"
            />
            <ErrorMessage
              name="companyName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Current Designation */}
          <div>
            <label htmlFor="designation" className="block text-sm font-medium">
              Current Designation
            </label>
            <Field
              type="text"
              id="designation"
              name="designation"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Current Designation"
            />
            <ErrorMessage
              name="designation"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Summary
            </label>
            <Field
              type="text"
              id="description"
              name="description"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Description"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Current Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Current Location
            </label>
            <CityStateCountrySearchBar
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

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium">
              Full Address
            </label>
            <Field
              type="text"
              id="address"
              name="address"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Address"
            />
            <ErrorMessage
              name="address"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* City */}
          {/* <div>
            <Field
              type="text"
              id="city"
              name="city"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="City"
            />
            <ErrorMessage
              name="city"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div> */}

          {/* Zip Code */}
          {/* <div>
            <Field
              type="text"
              id="zipCode"
              name="zipCode"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Zip Code"
            />
            <ErrorMessage
              name="zipCode"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div> */}

          {/* State */}
          {/* <div>
            <Field
              type="text"
              id="state"
              name="state"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="State"
            />
            <ErrorMessage
              name="state"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div> */}

          {/* Total Experience (Dropdown) */}
          {/* <div>
            <Field
              as="select"
              id="totalExperience"
              name="totalExperience"
              className="mt-1 p-3 w-full border rounded-md"
            >
              <option value="">Select Experience</option>
              {TOTAL_EXPERIENCE.map((exp, index) => (
                <option key={index} value={exp}>
                  {exp}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="totalExperience"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div> */}

          {/* Level (Dropdown) */}
          {/* <div>
            <Field
              as="select"
              id="level"
              name="level"
              className="mt-1 p-3 w-full border rounded-md"
            >
              <option value="">Select Level</option>
              {LEVELS.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="level"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div> */}

          {/* Preferred Industry */}
          {/* <div className="w-full mb-auto">
            <label htmlFor="industry" className="block text-sm font-medium">
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

          {/* Achievements */}
          {/* <div>
            <Field
              type="text"
              id="achievements"
              name="achievements"
              className="mt-1 p-3 w-full border rounded-md"
              placeholder="Achievements"
            />
            <ErrorMessage
              name="achievements"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div> */}

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
              {isLoading ? "Loading..." : "Update"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RecruiterProfile;
