"use client";

import SEOModal from "@/app/modals/SEOModal";
import AccessDeniedAdmin from "@/components/ui/AccessDeniedAdmin";
import { Loader } from "@/components/ui/loader";
import PlaceholderImage from "@/images/Profile_avatar_placeholder_large.png";
import {
  useGetCandidateProfileQuery,
  useUpdateProfilePicMutation,
  useUpdateResumeMutation,
} from "@/redux/api/candidateAuth";
import { Form, Formik } from "formik";
import { DownloadIcon, Edit2, FileIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CandidateEducationDetails from "./CandidateEducationDetails";
import CandidateJobPreference from "./CandidateJobPreference";
import CandidateRegisterForm from "./CandidateRegisterForm";
import CandidateWorkExperience from "./CandidateWorkExperience";

const profilePicSchema = Yup.object().shape({
  profilePic: Yup.mixed()
    .nullable()
    .required("Profile picture is required.")
    .test("fileType", "Unsupported File Format", (value) => {
      return (
        value && (value.type === "image/jpeg" || value.type === "image/png")
      );
    }),
});

const resumeSchema = Yup.object().shape({
  resume: Yup.mixed()
    .nullable()
    .required("Resume is required.")
    .test("fileType", "Unsupported File Format", (value) => {
      return (
        value &&
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(value.type)
      );
    }),
});

const CandidateProfile = ({ userid }) => {
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [showImage, setShowImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  const resumeInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [updateProfilePic, { isLoading: isSubmittingProfilePic }] =
    useUpdateProfilePicMutation();
  const [updateResume] = useUpdateResumeMutation();

  const { role, token } = useSelector((state) => state.auth);

  const { data, isLoading, error } = useGetCandidateProfileQuery({
    id: userid,
  });

  useEffect(() => {
    if (data?.profilePic) {
      setSelectedImage(data.profilePic);
      setShowImage(data.profilePic);
    }
    if (data?.resume) {
      setSelectedResume(data.resume);
    }
  }, [data]);

  const handleResumeClick = () => {
    setIsEditingResume(true);
    resumeInputRef.current.click();
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedResume(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed.");
        return; // don't proceed if invalid
      }
      setSelectedImage(file);
      setShowImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfilePic = async (values, { resetForm }) => {
    const profilePicData = new FormData();

    if (selectedImage) {
      profilePicData.append("profilePic", selectedImage);
    } else {
      profilePicData.append("profilePic", null);
    }

    try {
      await updateProfilePic({ userid, profilePicData }).unwrap();
      setIsEditingImage(false);
      toast.success("Profile Pic updated successfully!");
      resetForm();
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    }
  };

  const handleUpdateResume = async (values, { resetForm }) => {
    const resumeData = new FormData();

    if (selectedResume) {
      resumeData.append("resume", selectedResume);
    } else {
      resumeData.append("resume", null);
    }

    try {
      const response = await updateResume({ userid, resumeData }).unwrap();

      if (response.success) {
        toast.success("Resume updated successfully!");
        setIsEditingResume(false);
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full gap-8 p-4">
        <Loader count={5} height={50} className="mb-4" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Error loading profile data
      </div>
    );

  if (role !== "admin")
    return (
      <div className="flex items-center justify-center w-full p-2">
        <AccessDeniedAdmin title="admin" />
      </div>
    );

  return (
    <div className="bg-gray-200 px-4 lg:px-28 py-12 gap-8 flex flex-col min-h-screen w-full">
      <SEOModal slug="candidate_profile" />

      {/* Profile Image Section */}
      <div className="flex flex-col justify-center items-center relative w-full">
        <Formik
          initialValues={{ profilePic: selectedImage || "" }}
          validationSchema={profilePicSchema}
          onSubmit={handleUpdateProfilePic}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6 w-full">
              {/* Upload Image */}
              <div className="flex justify-center items-center">
                <label
                  htmlFor="image"
                  className="relative cursor-pointer group"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                    {showImage?.startsWith("blob:") ||
                    showImage?.startsWith("http") ? (
                      <img
                        src={showImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={PlaceholderImage}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Edit icon overlay */}
                  <div className="absolute bottom-1 right-1 p-1 bg-blue-800 rounded-full opacity-90 group-hover:opacity-100 transition-opacity">
                    <Edit2
                      className="w-4 h-4 text-white"
                      onClick={(e) => {
                        e.preventDefault(); // prevent label default
                        setIsEditingImage(true);
                        imageInputRef.current?.click();
                      }}
                    />
                  </div>
                </label>
                <input
                  type="file"
                  id="image"
                  name="profilePic"
                  accept="image/*"
                  ref={imageInputRef}
                  className="hidden"
                  onChange={(e) => {
                    handleImageUpload(e);
                    setFieldValue("profilePic", e.target.files[0]);
                  }}
                />
              </div>

              {isEditingImage && (
                <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    onClick={() => {
                      setIsEditingImage(false);
                      setSelectedImage(data?.profilePic || null);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-fit px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={isSubmittingProfilePic}
                  >
                    {isSubmittingProfilePic ? "Submitting..." : "Submit"}
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>

      <div className="w-full">
        <CandidateRegisterForm
          initialRegisterForm={{
            userid: { userid },
            token: { token },
            fullName: data?.registration?.fullName || "",
            email: data?.registration?.email || "",
            phone: data?.registration?.phone || "",
            location: data?.registration?.location || "",
            yearExp: data?.registration?.yearExp ?? 0,
            monthExp: data?.registration?.monthExp ?? 0,
            skills: data?.registration?.skills || [],
            // industry: data?.registration?.industry || "",
            jobDescription: data?.registration?.jobDescription || "",
            terms: data?.registration?.terms || false,
            resume: data?.registration?.resume || null,
          }}
        />
      </div>

      {/* Resume Upload Section */}
      <div className="flex flex-col justify-center items-center relative w-full">
        <Formik
          initialValues={{ resume: selectedResume || null }}
          validationSchema={resumeSchema}
          onSubmit={handleUpdateResume}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6 w-full">
              {/* Upload Resume */}
              <div className="flex justify-center items-center w-full">
                <label htmlFor="resume" className="relative w-full">
                  <div className="w-full bg-white shadow-sm rounded-lg border border-gray-300 p-4">
                    {selectedResume ? (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="w-6 h-6 md:w-10 md:h-10 bg-gray-200 flex justify-center items-center rounded-full">
                            <FileIcon className="text-gray-600 w-3 h-3 md:w-6 md:h-6" />
                          </div>
                          <div className="flex items-center gap-4 text-lg">
                            <span className="font-semibold text-xs md:text-base text-gray-700 truncate max-w-[150px] sm:max-w-[250px] md:max-w-[350px] inline-block">
                              {typeof selectedResume === "string"
                                ? decodeURIComponent(
                                    selectedResume
                                      .split("/")
                                      .pop()
                                      .split("?")[0]
                                  )
                                : selectedResume.name}
                            </span>
                            {typeof selectedResume === "string" ? (
                              <a
                                href={selectedResume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 font-medium hover:underline"
                              >
                                <DownloadIcon className="w-4 h-4 font-bold" />
                              </a>
                            ) : (
                              <span className="text-sm text-gray-500">
                                {selectedResume.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={handleResumeClick}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Edit
                          </button>
                          {/* Hidden file input for resume upload */}
                          <input
                            type="file"
                            id="resume"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            ref={resumeInputRef}
                            onChange={(e) => {
                              handleResumeUpload(e);
                              setFieldValue("resume", e.target.files[0]);
                              setSelectedResume(e.target.files[0]);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <span>No resume uploaded yet.</span>
                        <button
                          type="button"
                          onClick={handleResumeClick}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                        >
                          Upload Resume
                        </button>
                        {/* Hidden file input for resume upload */}
                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          ref={resumeInputRef}
                          onChange={(e) => {
                            handleResumeUpload(e);
                            setFieldValue("resume", e.target.files[0]);
                            setSelectedResume(e.target.files[0]);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Edit/Cancel buttons */}
              {isEditingResume && (
                <div className="flex justify-between gap-4 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    onClick={() => {
                      setIsEditingResume(false);
                      setSelectedResume(data?.resume || null);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Submit"}
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>

      <div className="w-full">
        <CandidateEducationDetails
          initialEducationDetails={{
            userid,
            token,
            candidateEducation: data?.candidateEducation || [],
          }}
        />
      </div>
      <div className="w-full">
        <CandidateJobPreference
          initialJobPreference={{
            userid: { userid },
            token: { token },
            profileTitle: data?.jobPreferences?.profileTitle || "",
            jobType: data?.jobPreferences?.jobType || "",
            preferredJobLocation:
              data?.jobPreferences?.preferredJobLocation || "",
            experienceYears: data?.jobPreferences?.experienceYears || "",
            experienceMonths: data?.jobPreferences?.experienceMonths || "",
            gender: data?.jobPreferences?.gender || "male",
            dob: data?.jobPreferences?.dob || new Date(),
            currentSalary: data?.jobPreferences?.currentSalary || 0,
            expectedSalary: data?.jobPreferences?.expectedSalary || 0,
            maritalStatus: data?.jobPreferences?.maritalStatus || "",
            language: data?.jobPreferences?.language || "",
          }}
        />
      </div>

      <div className="w-full">
        <CandidateWorkExperience
          initialWorkExperience={{
            userid: { userid },
            token: { token },
            workExperience: data?.workExperience || [],
          }}
        />
      </div>
    </div>
  );
};

export default CandidateProfile;
