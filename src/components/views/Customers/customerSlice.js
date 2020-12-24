import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerLoading: false,
  customerError: null,
  customerData: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerLoading(state, { payload }) {
      state.customerLoading = payload;
    },
    setCustomerError(state, { payload }) {
      state.customerError = payload;
      state.customerLoading = false;
    },
    setCustomerData(state, { payload }) {
      state.customerData = payload;
    },
  },
});

export const {
  setCustomerData,
  setCustomerError,
  setCustomerLoading,
} = customerSlice.actions;

export default customerSlice.reducer;
