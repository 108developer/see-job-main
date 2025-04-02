// Keep this file

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

const candidateAuth = createApi({
  reducerPath: "candidateAuth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/candidateAuthRoute`,
  }),
  endpoints: (builder) => ({
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
      query: ({ userid, token }) => ({
        url: `getCandidateProfile/${userid}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      query: ({ userId, token, jobData }) => ({
        url: `updateRegisteredCandidate/${userId}`,
        method: "PUT",
        body: jobData,
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

    // Upload Profile Picture
    uploadProfilePic: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("profilePic", file);
        return {
          url: "/upload/profile-pic",
          method: "POST",
          body: formData,
        };
      },
    }),

    // Upload Resume
    uploadResume: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("resume", file);
        return {
          url: "/upload/resume",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useSignupCandidateMutation,
  useLoginCandidateMutation,
  useGetCandidateProfileQuery,
  useRegisterCandidateMutation,
  useUpdateRegisteredCandidateMutation,
  useSaveJobPreferencesMutation,
  useUpdateJobPreferencesMutation,
  useSaveEducationalDetailsMutation,
  useUpdateEducationalDetailsMutation,
  useUploadProfilePicMutation,
  useUploadResumeMutation,
} = candidateAuth;

export default candidateAuth;
