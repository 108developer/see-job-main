// /frontend/src/api/jobs/jobsAPI.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const jobApi = createApi({
  reducerPath: "jobApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/jobs`,
  }),
  endpoints: (builder) => ({
    getAllJobs: builder.query({
      query: ({ page = 1, limit = 10, filters = {}, candidateId }) => {
        const queryParams = new URLSearchParams({
          page,
          limit,
          ...filters,
          candidateId,
        }).toString();
        return `getjobs?${queryParams}`;
      },
    }),
    getJobById: builder.query({
      query: (jobId) => `getjob/${jobId}`,
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

    applyToJob: builder.mutation({
      query: ({ jobId, candidateId, answers }) => ({
        url: "applyToJob",
        method: "POST",
        body: { jobId, candidateId, answers },
      }),
    }),

    autoApplyToJobs: builder.mutation({
      query: (body) => ({
        url: "autoApplyToJobs",
        method: "POST",
        body,
      }),
    }),

    getJobApplicants: builder.query({
      query: (jobId) => `applicants/${jobId}`,
    }),

    getJobsPostedByRecruiter: builder.query({
      query: ({ userId, page }) =>
        `getJobsPostedByRecruiter/${userId}?page=${page}`,
    }),

    getJobsAppliedByCandidate: builder.query({
      query: ({ userId, page }) =>
        `getJobsAppliedByCandidate/${userId}?page=${page}`,
    }),

    getJobsApplications: builder.query({
      query: ({ jobId, page }) =>
        `getJobsAppliedByCandidate/${jobId}?page=${page}`,
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useGetJobDetailsQuery,
  usePostJobMutation,
  useApplyToJobMutation,
  useAutoApplyToJobsMutation,
  useGetJobApplicantsQuery,
  useGetJobsPostedByRecruiterQuery,
  useGetJobsAppliedByCandidateQuery,
  useGetJobsApplicationsQuery,
} = jobApi;

export default jobApi;
