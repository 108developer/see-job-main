// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const verifyPayment = createAsyncThunk(
//   "payment/verifyPayment",
//   async (paymentData, thunkAPI) => {
//     const res = await fetch("/api/payment/verify-payment", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(paymentData),
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || "Verification failed");
//     return data.message;
//   }
// );

// const paymentSlice = createSlice({
//   name: "payment",
//   initialState: {
//     status: "idle", // idle | pending | succeeded | failed
//     message: null,
//     error: null,
//   },
//   reducers: {
//     reset: (state) => {
//       state.status = "idle";
//       state.message = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(verifyPayment.pending, (state) => {
//         state.status = "pending";
//         state.error = null;
//         state.message = null;
//       })
//       .addCase(verifyPayment.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.message = action.payload;
//       })
//       .addCase(verifyPayment.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// export const { reset } = paymentSlice.actions;
// export default paymentSlice.reducer;

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::                        ::::::::::::::::::::::::::
// :::::::::::::::::                        ::::::::::::::::::::::::::
// :::::::::::::::::                        ::::::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  message: null,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    paymentStarted: (state) => {
      state.status = "pending";
      state.error = null;
      state.message = null;
    },
    paymentSuccess: (state, action) => {
      state.status = "succeeded";
      state.message = action.payload;
    },
    paymentFailed: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    reset: (state) => {
      state.status = "idle";
      state.message = null;
      state.error = null;
    },
  },
});

export const { paymentStarted, paymentSuccess, paymentFailed, reset } =
  paymentSlice.actions;

export default paymentSlice.reducer;
