import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const admin = createApi({
  reducerPath: "admin",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/admin`,
  }),
  endpoints: (builder) => ({
    // Endpoint to login admin
    adminLogin: builder.mutation({
      query: (loginData) => ({
        url: "adminLogin",
        method: "POST",
        body: loginData,
      }),
    }),

    // Endpoint to fetch all job seekers
    getAllJobSeekers: builder.query({
      query: ({
        page = 1,
        limit = 20,
        search = "",
        sortBy = "name",
        sortOrder = "asc",
      }) => ({
        url: `getAllJobSeekers?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: "GET",
      }),
    }),

    // Endpoint to fetch all recruiters
    getAllRecruiters: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortBy = "name",
        sortOrder = "asc",
      }) => ({
        url: `getAllRecruiters?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: "GET",
      }),
    }),

    // Endpoint to fetch all jobs details
    getAllJobs: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortBy = "name",
        sortOrder = "asc",
      }) => ({
        url: `getAllJobs?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        method: "GET",
      }),
    }),

    updatePlan: builder.mutation({
      query: ({ id, body }) => ({
        url: `updatePlan?id=${id}`,
        method: "POST",
        body,
      }),
    }),

    sendNewsLetter: builder.mutation({
      query: ({ receivers, subject, message }) => ({
        url: "sendNewsLetter",
        method: "POST",
        body: {
          receivers,
          subject,
          message,
        },
      }),
    }),

    // About, Privacy, & Terms Pages Endpoints
    getPageData: builder.query({
      query: (type) => `pages/${type}`,
    }),

    postPageData: builder.mutation({
      query: ({ type, description }) => ({
        url: `pages/${type}`,
        method: "POST",
        body: { description },
      }),
    }),

    updatePageData: builder.mutation({
      query: ({ type, description }) => ({
        url: `pages/${type}`,
        method: "PUT",
        body: { description },
      }),
    }),

    // Contact Page Endpoints
    getContactData: builder.query({
      query: () => "contact",
    }),

    postContactData: builder.mutation({
      query: (formData) => ({
        url: "contact",
        method: "POST",
        body: formData,
      }),
    }),

    updateContactData: builder.mutation({
      query: (formData) => ({
        url: "contact",
        method: "PUT",
        body: formData,
      }),
    }),

    contactEnquiery: builder.mutation({
      query: (postData) => ({
        url: "contactEnquiery",
        method: "POST",
        body: postData,
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAllJobSeekersQuery,
  useGetAllRecruitersQuery,
  useGetAllJobsQuery,
  useUpdatePlanMutation,
  useSendNewsLetterMutation,

  // Pages Endpoint
  useGetPageDataQuery,
  usePostPageDataMutation,
  useUpdatePageDataMutation,

  // Contact Page
  useGetContactDataQuery,
  usePostContactDataMutation,
  useUpdateContactDataMutation,
  useContactEnquieryMutation,
} = admin;

export default admin;
