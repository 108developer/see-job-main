"use client";
import {
  useGetCandidateProfileQuery,
  useUploadProfilePicMutation,
  useUploadResumeMutation,
} from "@/redux/api/candidateAuth";
import { Edit, Edit2, File, User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CandidateEducationDetails from "./CandidateEducationDetails";
import CandidateJobPreference from "./CandidateJobPreference";
import CandidateRegisterForm from "./CandidateRegisterForm";

const Page = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImageSelected, setNewImageSelected] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [newResumeSelected, setNewResumeSelected] = useState(false);

  const [selectedResume, setSelectedResume] = useState(null);

  const { userid, token } = useSelector((state) => state.auth);

  const { data, isLoading, error } = useGetCandidateProfileQuery({
    userid,
    token,
  });

  useEffect(() => {
    if (data?.profilePic) {
      setSelectedImage(data.profilePic);
    }
    if (data?.resume) {
      setSelectedResume(data.resume);
    }
  }, [data]);

  const [uploadProfilePic] = useUploadProfilePicMutation();
  const [uploadResume] = useUploadResumeMutation();

  const handleImageUpload = async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      try {
        const response = await uploadProfilePic(file).unwrap();
        setSelectedImage(URL.createObjectURL(file));
        console.log("Profile picture uploaded successfully", response);
        setIsEditingImage(false);
        setNewImageSelected(false);
      } catch (error) {
        console.log("Error uploading profile picture:", error);
      }
    } else {
      console.log("No file selected");
    }
  };

  const handleCancelImageUpload = () => {
    setIsEditingImage(false);
    setNewImageSelected(false);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageSelected(true);
    } else {
      setNewImageSelected(false);
    }
  };

  const handleResumeSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setSelectedResume(file);
      setNewResumeSelected(true);
    } else {
      setNewResumeSelected(false);
    }
  };

  const handleResumeUpdate = async () => {
    const fileInput = document.getElementById("file");
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      try {
        const response = await uploadResume(file).unwrap();
        console.log("Resume uploaded successfully", response);

        setSelectedResume(URL.createObjectURL(file));
        setNewResumeSelected(false);
      } catch (error) {
        console.log("Error uploading resume:", error);
      }
    }
  };

  const handleCancelResumeUpload = () => {
    setNewResumeSelected(false);
    setSelectedResume(data?.resume);
  };

  if (isLoading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Error loading profile data
      </div>
    );

  return (
    <div className="bg-gray-200 px-4 lg:px-28 py-12 gap-8 flex flex-col min-h-screen w-full">
      {/* Profile Image Section */}
      <div className="flex flex-col justify-center items-center relative w-full">
        <label htmlFor="image" className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden flex justify-center items-center relative">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Uploaded Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User2Icon className="text-gray-400 text-4xl w-full h-full bg-white rounded-full" />
            )}
          </div>
          <div
            className="absolute bottom-1 right-0 p-1 bg-blue-500 rounded-full cursor-pointer"
            onClick={() => setIsEditingImage(true)}
          >
            <Edit2 className="w-4 h-4 text-white z-10" />
          </div>
        </label>

        {/* Hidden file input */}
        {isEditingImage && (
          <div className="absolute bottom-0 left-0 w-full flex justify-between p-2">
            <input
              type="file"
              id="image"
              name="profilePic"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleFileSelect(e);
                handleImageUpload(e);
              }}
            />
          </div>
        )}

        {newImageSelected && (
          <div className="flex items-center gap-8 mt-4">
            <div
              type="button"
              onClick={handleCancelImageUpload}
              className="px-2 py-1 bg-red-500 text-white rounded-md cursor-pointer"
            >
              Cancel
            </div>
            <div
              type="button"
              onClick={() => document.getElementById("image").click()}
              className="px-2 py-1 bg-blue-500 text-white rounded-md cursor-pointer"
            >
              Update
            </div>
          </div>
        )}
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
            minexp: data?.registration?.minexp || "",
            maxexp: data?.registration?.maxexp || "",
            skills: data?.registration?.skills || [],
            industry: data?.registration?.industry || "",
            jobDescription: data?.registration?.jobDescription || "",
            terms: data?.registration?.terms || false,
            resume: data?.registration?.resume || null,
          }}
        />
      </div>

      {/* Upload Resume */}
      <div className="space-y-6 bg-white rounded-xl border p-8 w-full">
        <div className="flex justify-between items-center">
          <label htmlFor="file" className="block text-sm font-semibold">
            Upload Resume
          </label>

          {/* Pencil Icon for Resume */}
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => document.getElementById("file").click()}
          >
            <Edit className="text-gray-500 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 flex justify-center items-center gap-4 bg-gray-200 rounded-full mr-4">
            <File className="text-gray-500 text-xl" />
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            id="file"
            name="file"
            className="hidden"
            accept=".pdf, .doc, .docx"
            onChange={handleResumeSelect}
          />

          {/* Display the file name if a new resume is selected */}
          {newResumeSelected && selectedResume ? (
            <div className="mt-2 text-sm text-gray-700">
              <strong>{selectedResume.name}</strong>
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-700">
              {selectedResume ? (
                typeof selectedResume === "string" ? (
                  <a
                    href={selectedResume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 font-semibold underline"
                  >
                    {/* {selectedResume.split("/").pop()}{" "} */}
                    RESUME
                  </a>
                ) : (
                  <span className="text-gray-500">{selectedResume.name}</span>
                )
              ) : (
                <span className="text-gray-500">No resume uploaded yet.</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Show Cancel and Update buttons when a new resume is selected */}
          {newResumeSelected && (
            <>
              <button
                type="button"
                onClick={handleCancelResumeUpload}
                className="px-2 py-1 bg-red-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResumeUpdate}
                className="px-2 py-1 bg-blue-500 text-white rounded-md"
              >
                Update
              </button>
            </>
          )}
        </div>
      </div>

      <div className="w-full">
        <CandidateEducationDetails
          initialEducationDetails={{
            userid: { userid },
            token: { token },
            highestQualification:
              data?.candidateEducation?.highestQualification || "",
            medium: data?.candidateEducation?.medium || "",
            boardOfEducation: data?.candidateEducation?.boardOfEducation || "",
            percentage: data?.candidateEducation?.percentage || "",
            yearOfEducation: data?.candidateEducation?.yearOfEducation || "",
            educationMode: data?.candidateEducation?.educationMode || "",
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
            experienceYears: data?.jobPreferences?.experienceYears || "",
            experienceMonths: data?.jobPreferences?.experienceMonths || "",
            gender: data?.jobPreferences?.gender || "male",
            dob: data?.jobPreferences?.dob || new Date(),
            maritalStatus: data?.jobPreferences?.maritalStatus || "",
            language: data?.jobPreferences?.language || "",
          }}
        />
      </div>
    </div>
  );
};

export default Page;
