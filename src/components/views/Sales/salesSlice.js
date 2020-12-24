const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  salesLoading: false,
  salesError: null,
  salesData: [],
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setSalesLoading(state, { payload }) {
      state.salesLoading = payload;
    },
    setSalesError(state, { payload }) {
      state.salesError = payload;
      state.salesLoading = false;
    },
    setSalesData(state, { payload }) {
      state.salesData = payload;
    },
  },
});

export const {
  setSalesData,
  setSalesError,
  setSalesLoading,
} = salesSlice.actions;

export default salesSlice.reducer;
