import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import candidateAuth from "./api/candidateAuth";
import employerAuth from "./api/employerAuth";
import jobApi from "./api/jobApi";
import authSlice from "./slices/authSlice";
// import candidateProfileSlice from "./slices/candidateProfileSlice";
import modalSlice from "./slices/modalSlice";
import groupedFilterApi from "./api/groupedFilterApi";

const store = configureStore({
  reducer: {
    modal: modalSlice,
    auth: authSlice,
    // candidateProfile: candidateProfileSlice,
    [employerAuth.reducerPath]: employerAuth.reducer,
    [candidateAuth.reducerPath]: candidateAuth.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [groupedFilterApi.reducerPath]: groupedFilterApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      candidateAuth.middleware,
      employerAuth.middleware,
      jobApi.middleware,
      groupedFilterApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
