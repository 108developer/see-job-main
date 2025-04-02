// /frontend/src/api/jobs/jobsAPI.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/jobs`,
  }),
  endpoints: (builder) => ({
    getAllJobs: builder.query({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        const queryParams = new URLSearchParams({
          page,
          limit,
          ...filters,
        }).toString();
        return `getjobs?${queryParams}`;
      },
    }),
    getJobDetails: builder.query({
      query: (jobId) => `${jobId}`,
    }),
    postJob: builder.mutation({
      query: (jobData) => ({
        url: "post-job",
        method: "POST",
        body: jobData,
      }),
    }),
  }),
});

export const { useGetAllJobsQuery, useGetJobDetailsQuery, usePostJobMutation } =
  jobApi;

export default jobApi;
