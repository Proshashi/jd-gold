import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemsData: [],
  itemsError: null,
  itemsLoading: false,
};

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItemsLoading(state, { payload }) {
      state.itemsLoading = payload;
    },
    setItemsError(state, { payload }) {
      state.itemsLoading = false;
      state.itemsError = payload;
    },
    setItemsData(state, { payload }) {
      state.itemsData = payload;
    },
  },
});

export const {
  setItemsData,
  setItemsError,
  setItemsLoading,
} = itemSlice.actions;

export default itemSlice.reducer;
