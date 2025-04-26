import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000"; // Fixed the semicolon issue

const employerAuth = createApi({
  reducerPath: "employerAuth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/employerAuthRoute`, // Ensure the base URL is correct
  }),
  endpoints: (builder) => ({
    employerRegistration: builder.mutation({
      query: (employerData) => ({
        url: "register",
        method: "POST",
        body: employerData,
      }),
    }),
    employerLogin: builder.mutation({
      query: (loginData) => ({
        url: "login",
        method: "POST",
        body: loginData,
      }),
    }),
    getEmployerProfile: builder.query({
      query: ({ userid, token }) => ({
        url: `getEmployerProfile/${userid}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateRecruiter: builder.mutation({
      query: ({ userid, token, userData }) => ({
        url: `updateRecruiter/${userid}`,
        method: "PUT",
        body: userData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useEmployerRegistrationMutation,
  useEmployerLoginMutation,
  useGetEmployerProfileQuery,
  useUpdateRecruiterMutation,
} = employerAuth;

export default employerAuth;
