// // EDITED

// import { createSlice } from "@reduxjs/toolkit";
// import { candidateAuthApi } from "../api/authApi";

// const initialState = {
//   profile: null,
//   loading: false,
//   error: null,
// };

// const candidateProfileSlice = createSlice({
//   name: "candidateProfile",
//   initialState,
//   reducers: {
//     resetProfileState: (state) => {
//       state.profile = null;
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // For profile data fetch
//       .addMatcher(
//         candidateAuthApi.endpoints.profileData.matchPending,
//         (state) => {
//           state.loading = true;
//         }
//       )
//       .addMatcher(
//         candidateAuthApi.endpoints.profileData.matchFulfilled,
//         (state, action) => {
//           state.loading = false;
//           state.profile = action.payload.user;
//         }
//       )
//       .addMatcher(
//         candidateAuthApi.endpoints.profileData.matchRejected,
//         (state, action) => {
//           state.loading = false;
//           state.error = action.error.message;
//         }
//       )
//       // For updating profile
//       .addMatcher(
//         candidateAuthApi.endpoints.updateProfile.matchPending,
//         (state) => {
//           state.loading = true;
//         }
//       )
//       .addMatcher(
//         candidateAuthApi.endpoints.updateProfile.matchFulfilled,
//         (state, action) => {
//           state.loading = false;
//           state.profile = action.payload.user;
//         }
//       )
//       .addMatcher(
//         candidateAuthApi.endpoints.updateProfile.matchRejected,
//         (state, action) => {
//           state.loading = false;
//           state.error = action.error.message;
//         }
//       );
//   },
// });

// export const { resetProfileState } = candidateProfileSlice.actions;

// export default candidateProfileSlice.reducer;
