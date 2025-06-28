// Keep this file

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const candidateAuth = createApi({
  reducerPath: "candidateAuth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/candidateAuthRoute`,
  }),
  endpoints: (builder) => ({
    bulkUploadCandidates: builder.mutation({
      query: (formData) => ({
        url: "bulkUploadCandidates",
        method: "POST",
        body: formData,
      }),
    }),
    uploadResume: builder.mutation({
      query: (candidateData) => ({
        url: "uploadResume",
        method: "POST",
        body: candidateData,
      }),
    }),
    signupCandidate: builder.mutation({
      query: (candidateData) => ({
        url: "signup",
        method: "POST",
        body: candidateData,
      }),
    }),
    loginCandidate: builder.mutation({
      query: (loginData) => ({
        url: "login",
        method: "POST",
        body: loginData,
      }),
    }),
    getCandidateProfile: builder.query({
      query: ({ id, jobId }) => ({
        url: `getCandidateProfile/${id}${jobId ? `?jobId=${jobId}` : ""}`,
        method: "GET",
      }),
    }),

    // Forgot Password
    sendCandidateOtp: builder.mutation({
      query: (emailData) => ({
        url: "sendCandidateOtp",
        method: "POST",
        body: emailData,
      }),
    }),

    verifyCandidateOtp: builder.mutation({
      query: (otpData) => ({
        url: "verifyCandidateOtp",
        method: "POST",
        body: otpData,
      }),
    }),

    resetCandidatePassword: builder.mutation({
      query: (values) => ({
        url: "resetCandidatePassword",
        method: "POST",
        body: values,
      }),
    }),

    // Register Candidate
    registerCandidate: builder.mutation({
      query: (candidateData) => ({
        url: "register",
        method: "POST",
        body: candidateData,
      }),
    }),
    updateRegisteredCandidate: builder.mutation({
      query: ({ userid, token, registerData }) => ({
        url: `updateRegisteredCandidate/${userid}`,
        method: "PUT",
        body: registerData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // JobPreferences
    saveJobPreferences: builder.mutation({
      query: (data) => ({
        url: `saveJobPreferences`,
        method: "POST",
        body: data,
      }),
    }),
    updateJobPreferences: builder.mutation({
      query: ({ userid, token, jobData }) => ({
        url: `updateJobPreferences/${userid}`,
        method: "PUT",
        body: jobData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // EducationalDetails
    saveEducationalDetails: builder.mutation({
      query: (data) => ({
        url: `saveEducationalDetails`,
        method: "POST",
        body: data,
      }),
    }),
    updateEducationalDetails: builder.mutation({
      query: ({ userid, token, educationData }) => ({
        url: `updateEducationalDetails/${userid}`,
        method: "PUT",
        body: educationData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // Update Profile Picture
    updateProfilePic: builder.mutation({
      query: ({ userid, profilePicData }) => {
        return {
          url: `/updateProfilePic/${userid}`,
          method: "PUT",
          body: profilePicData,
        };
      },
    }),

    // Update Resume
    updateResume: builder.mutation({
      query: ({ userid, resumeData }) => {
        return {
          url: `/updateResume/${userid}`,
          method: "PUT",
          body: resumeData,
        };
      },
    }),

    /* ──────────────────────────────────────────────────────
     *                Work Experience Endpoints
     * ────────────────────────────────────────────────────── */
    getWorkExperience: builder.query({
      query: (userid) => ({
        url: `/getWorkExperience/${userid}`,
        method: "GET",
      }),
    }),
    addWorkExperience: builder.mutation({
      query: ({ userid, workExperienceData }) => ({
        url: `/addWorkExperience/${userid}`,
        method: "POST",
        body: workExperienceData,
      }),
    }),
    updateWorkExperience: builder.mutation({
      query: ({ userid, updatedExperienceData }) => ({
        url: `/updateWorkExperience/${userid}`,
        method: "PUT",
        body: updatedExperienceData,
      }),
    }),
    deleteWorkExperience: builder.mutation({
      query: ({ userid, experienceId }) => ({
        url: `/deleteWorkExperience/${userid}/${experienceId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useBulkUploadCandidatesMutation,
  useSignupCandidateMutation,
  useUploadResumeMutation,
  useLoginCandidateMutation,
  useGetCandidateProfileQuery,
  // Forgot Password
  useSendCandidateOtpMutation,
  useVerifyCandidateOtpMutation,
  useResetCandidatePasswordMutation,

  // Registration process
  useRegisterCandidateMutation,
  useUpdateRegisteredCandidateMutation,
  useSaveJobPreferencesMutation,
  useUpdateJobPreferencesMutation,
  useSaveEducationalDetailsMutation,
  useUpdateEducationalDetailsMutation,
  useUpdateProfilePicMutation,
  useUpdateResumeMutation,

  // Work Experience
  useGetWorkExperienceQuery,
  useAddWorkExperienceMutation,
  useUpdateWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
} = candidateAuth;

export default candidateAuth;
