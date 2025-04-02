// // EDITED

// // /frontend/src/api/candidates/candidatesAPI.js
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const candidateApi = createApi({
//   reducerPath: "candidateApi",
//   baseQuery: fetchBaseQuery({ baseUrl: "/api/candidates/" }),
//   endpoints: (builder) => ({
//     applyForJob: builder.mutation({
//       query: ({ candidateId, jobId }) => ({
//         url: `${candidateId}/apply`,
//         method: "POST",
//         body: { jobId },
//       }),
//     }),
//     getCandidateApplications: builder.query({
//       query: (candidateId) => `${candidateId}/applications`,
//     }),
//   }),
// });

// export const { useApplyForJobMutation, useGetCandidateApplicationsQuery } =
//   candidateApi;
