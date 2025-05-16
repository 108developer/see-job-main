import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

    // Forgot Password
    sendEmployerOtp: builder.mutation({
      query: (emailData) => ({
        url: "sendEmployerOtp",
        method: "POST",
        body: emailData,
      }),
    }),

    verifyEmployerOtp: builder.mutation({
      query: (otpData) => ({
        url: "verifyEmployerOtp",
        method: "POST",
        body: otpData,
      }),
    }),

    resetEmployerPassword: builder.mutation({
      query: (values) => ({
        url: "resetEmployerPassword",
        method: "POST",
        body: values,
      }),
    }),
  }),
});

export const {
  useEmployerRegistrationMutation,
  useEmployerLoginMutation,
  useGetEmployerProfileQuery,
  useUpdateRecruiterMutation,
  // Forgot Password
  useSendEmployerOtpMutation,
  useVerifyEmployerOtpMutation,
  useResetEmployerPasswordMutation,
} = employerAuth;

export default employerAuth;
