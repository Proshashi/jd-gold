import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stockData: {},
  itemsUnit: localStorage.getItem("dataUnit"),
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardStockData(state, { payload }) {
      state.stockData = payload;
    },
    setDashboardItemLoading(state, { payload }) {
      state.loading = payload;
    },
    setDashboardItemError(state, { payload }) {
      state.error = payload;
    },
    setDashboardStockUnit(state, { payload }) {
      state.itemsUnit = payload;
    },
  },
});

export const {
  setDashboardItemError,
  setDashboardItemLoading,
  setDashboardStockData,
  setDashboardStockUnit,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
