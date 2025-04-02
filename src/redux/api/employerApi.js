// /frontend/src/api/employers/employersAPI.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employerApi = createApi({
  reducerPath: "employerApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/employers/" }),
  endpoints: (builder) => ({
    getEmployerJobs: builder.query({
      query: (employerId) => `${employerId}/jobs`,
    }),
    createJobListing: builder.mutation({
      query: (jobData) => ({
        url: "post-job",
        method: "POST",
        body: jobData,
      }),
    }),
  }),
});

export const { useGetEmployerJobsQuery, useCreateJobListingMutation } =
  employerApi;
