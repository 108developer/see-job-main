// Path : redux/api/groupedFilterApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const groupedFilterApi = createApi({
  reducerPath: "groupedFilterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/admin/groupedFilterApi`,
  }),
  endpoints: (builder) => ({
    // Skill Endpoints
    bulkUploadSkills: builder.mutation({
      query: (formData) => ({
        url: "skills/bulk-upload",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),

    getSkills: builder.query({
      query: ({ page = 1 }) => `skills?page=${page}`,
    }),

    addSkill: builder.mutation({
      query: (newSkill) => ({
        url: "skills",
        method: "POST",
        body: newSkill,
      }),
    }),

    updateSkill: builder.mutation({
      query: (updatedSkill) => ({
        url: `skills/${updatedSkill._id}`,
        method: "PUT",
        body: updatedSkill,
      }),
    }),

    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `skills/${id}`,
        method: "DELETE",
      }),
    }),

    // Job Title Endpoints
    bulkUploadJobTitles: builder.mutation({
      query: (formData) => ({
        url: "jobtitles/bulk-upload",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),

    getJobTitles: builder.query({
      query: ({ page = 1 }) => `jobTitles?page=${page}`,
    }),

    addJobTitle: builder.mutation({
      query: (newJobTitle) => ({
        url: "jobTitles",
        method: "POST",
        body: newJobTitle,
      }),
    }),

    updateJobTitle: builder.mutation({
      query: (updatedJobTitle) => ({
        url: `jobTitles/${updatedJobTitle._id}`,
        method: "PUT",
        body: updatedJobTitle,
      }),
    }),

    deleteJobTitle: builder.mutation({
      query: (id) => ({
        url: `jobTitles/${id}`,
        method: "DELETE",
      }),
    }),

    // Degree Endpoints
    bulkUploadDegrees: builder.mutation({
      query: (formData) => ({
        url: "degrees/bulk-upload",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),

    getDegrees: builder.query({
      query: ({ page = 1 }) => `degrees?page=${page}`,
    }),

    addDegree: builder.mutation({
      query: (newDegree) => ({
        url: "degrees",
        method: "POST",
        body: newDegree,
      }),
    }),

    updateDegree: builder.mutation({
      query: (updatedDegree) => ({
        url: `degrees/${updatedDegree._id}`,
        method: "PUT",
        body: updatedDegree,
      }),
    }),

    deleteDegree: builder.mutation({
      query: (id) => ({
        url: `degrees/${id}`,
        method: "DELETE",
      }),
    }),

    // Boards Endpoints
    bulkUploadBoards: builder.mutation({
      query: (formData) => ({
        url: "boards/bulk-upload",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),

    getBoards: builder.query({
      query: ({ page = 1 }) => `boards?page=${page}`,
    }),

    addBoard: builder.mutation({
      query: (newBoard) => ({
        url: "boards",
        method: "POST",
        body: newBoard,
      }),
    }),

    updateBoard: builder.mutation({
      query: (updatedBoard) => ({
        url: `boards/${updatedBoard._id}`,
        method: "PUT",
        body: updatedBoard,
      }),
    }),

    deleteBoard: builder.mutation({
      query: (id) => ({
        url: `boards/${id}`,
        method: "DELETE",
      }),
    }),

    // Industry Endpoints
    bulkUploadIndustries: builder.mutation({
      query: (formData) => ({
        url: "industries/bulk-upload",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),

    getIndustries: builder.query({
      query: ({ page = 1 }) => `industries?page=${page}`,
    }),

    addIndustry: builder.mutation({
      query: (newIndustry) => ({
        url: "industries",
        method: "POST",
        body: newIndustry,
      }),
    }),

    updateIndustry: builder.mutation({
      query: (updatedIndustry) => ({
        url: `industries/${updatedIndustry._id}`,
        method: "PUT",
        body: updatedIndustry,
      }),
    }),

    deleteIndustry: builder.mutation({
      query: (id) => ({
        url: `industries/${id}`,
        method: "DELETE",
      }),
    }),

    // Language Endpoints
    bulkUploadLanguages: builder.mutation({
      query: (formData) => ({
        url: "languages/bulk-upload",
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),

    getLanguages: builder.query({
      query: ({ page = 1 }) => `languages?page=${page}`,
    }),

    addLanguage: builder.mutation({
      query: (newLanguage) => ({
        url: "languages",
        method: "POST",
        body: newLanguage,
      }),
    }),

    updateLanguage: builder.mutation({
      query: (updatedLanguage) => ({
        url: `languages/${updatedLanguage._id}`,
        method: "PUT",
        body: updatedLanguage,
      }),
    }),

    deleteLanguage: builder.mutation({
      query: (id) => ({
        url: `languages/${id}`,
        method: "DELETE",
      }),
    }),

    // Locations Endpoints
    bulkUploadLocations: builder.mutation({
      query: (formData) => ({
        url: "locations/bulk-upload",
        method: "POST",
        body: formData,
      }),
    }),

    addLocation: builder.mutation({
      query: (newLocation) => ({
        url: "locations",
        method: "POST",
        body: newLocation,
      }),
    }),

    getLocation: builder.query({
      query: (id) => `locations/${id}`,
    }),

    getLocations: builder.query({
      query: ({ page = 1 }) => `locations?page=${page}`,
    }),

    updateLocation: builder.mutation({
      query: ({ id, updatedLocation }) => ({
        url: `locations/${id}`,
        method: "PUT",
        body: updatedLocation,
      }),
    }),

    deleteLocation: builder.mutation({
      query: (id) => ({
        url: `locations/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  // Skill Hooks
  useBulkUploadSkillsMutation,
  useGetSkillsQuery,
  useAddSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,

  // Job Title Hooks
  useBulkUploadJobTitlesMutation,
  useGetJobTitlesQuery,
  useAddJobTitleMutation,
  useUpdateJobTitleMutation,
  useDeleteJobTitleMutation,

  // Degree Hooks
  useBulkUploadDegreesMutation,
  useGetDegreesQuery,
  useAddDegreeMutation,
  useUpdateDegreeMutation,
  useDeleteDegreeMutation,

  // Boards Hooks
  useBulkUploadBoardsMutation,
  useGetBoardsQuery,
  useAddBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,

  // Industry Hooks
  useBulkUploadIndustriesMutation,
  useGetIndustriesQuery,
  useAddIndustryMutation,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation,

  // Language Hooks
  useBulkUploadLanguagesMutation,
  useGetLanguagesQuery,
  useAddLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,

  // Locations Hooks
  useBulkUploadLocationsMutation,
  useAddLocationMutation,
  useGetLocationQuery,
  useGetLocationsQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = groupedFilterApi;

export default groupedFilterApi;
