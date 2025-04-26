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
      query: ({ id }) => ({
        url: `getCandidateProfile/${id}`,
        method: "GET",
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
  useUpdateProfilePicMutation,
  useUpdateResumeMutation,
} = candidateAuth;

export default candidateAuth;
