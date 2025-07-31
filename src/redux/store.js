import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import admin from "./api/admin";
import candidateAuth from "./api/candidateAuth";
import employerAuth from "./api/employerAuth";
import groupedFilterApi from "./api/groupedFilterApi";
import jobApi from "./api/jobApi";
import authSlice from "./slices/authSlice";
import modalSlice from "./slices/modalSlice";
import paymentReducer from "./slices/paymentSlice";
import paymentApi from "./api/paymentApi";
import blogApi from "./api/blogApi";

const store = configureStore({
  reducer: {
    modal: modalSlice,
    auth: authSlice,
    // candidateProfile: candidateProfileSlice,
    [admin.reducerPath]: admin.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [employerAuth.reducerPath]: employerAuth.reducer,
    [candidateAuth.reducerPath]: candidateAuth.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [groupedFilterApi.reducerPath]: groupedFilterApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      admin.middleware,
      candidateAuth.middleware,
      employerAuth.middleware,
      jobApi.middleware,
      groupedFilterApi.middleware,
      paymentApi.middleware,
      blogApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
