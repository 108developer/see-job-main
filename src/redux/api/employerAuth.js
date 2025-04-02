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
  }),
});

export const { useEmployerRegistrationMutation, useEmployerLoginMutation } =
  employerAuth;

export default employerAuth;
