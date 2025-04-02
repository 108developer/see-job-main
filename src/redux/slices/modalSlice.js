// Path : /src/store/slices/modalSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalType: null,
  modalProps: {},
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modalType = action.payload.modalType;
      state.modalProps = action.payload.modalProps || {};
    },
    closeModal: (state) => {
      state.modalType = null;
      state.modalProps = {};
    },
  },
});

export const { setModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
