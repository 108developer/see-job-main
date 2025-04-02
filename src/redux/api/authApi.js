// PATH : see-job-main/src/redux/api/authApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

export const candidateAuthApi = createApi({
  reducerPath: "candidateAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/candidateAuth/` }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),
    profileData: builder.query({
      query: (userid) => ({
        url: `profile/${userid}`,
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: ({ userid, ...profileData }) => {
        return {
          url: `update/${userid}`,
          method: "PUT",
          body: profileData,
        };
      },
    }),
  }),
});

export const employerAuthApi = createApi({
  reducerPath: "employerAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/employerauth` }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/admin` }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation: useCandidateLoginMutation,
  useRegisterMutation: useCandidateRegisterMutation,
  useProfileDataQuery: useCandidateProfileDataQuery,
  useLazyProfileDataQuery: useLazyCandidateProfileDataQuery,
  useUpdateProfileMutation: useUpdateCandidateProfileMutation,
} = candidateAuthApi;

export const {
  useLoginMutation: useEmployerLoginMutation,
  useRegisterMutation: useEmployerRegisterMutation,
} = employerAuthApi;

export const { useLoginMutation: useAdminLoginMutation } = adminAuthApi;
