import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/payment` }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (amount) => ({
        url: "create-order",
        method: "POST",
        body: { amount },
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "verify-payment",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyPaymentMutation } = paymentApi;

export default paymentApi;
