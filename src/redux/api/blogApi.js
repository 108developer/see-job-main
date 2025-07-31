import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/blog`,
  }),
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    // Create blog
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: "create-blog",
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Get all blogs
    getAllBlog: builder.query({
      query: () => "get-all-blog",
      providesTags: ["Blog"],
    }),

    // Get blog by URL
    getBlogByUrl: builder.query({
      query: (url) => `get-blog-by-url/${url}`,
    }),

    // Update blog by ID
    updateBlogById: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `update-blog-by-id/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Delete blog by ID
    deleteBlogById: builder.mutation({
      query: (id) => ({
        url: `delete-blog-by-id/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useGetAllBlogQuery,
  useGetBlogByUrlQuery,
  useUpdateBlogByIdMutation,
  useDeleteBlogByIdMutation,
} = blogApi;

export default blogApi;
