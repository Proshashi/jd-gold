import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  importLoading: false,
  importError: null,
  importData: [],
};

const importSlice = createSlice({
  name: "import",
  initialState,
  reducers: {
    setImportLoading(state, { payload }) {
      state.importLoading = payload;
    },
    setImportError(state, { payload }) {
      state.importError = payload;
      state.importLoading = false;
    },
    setImportData(state, { payload }) {
      state.importData = payload;
    },
  },
});

export const {
  setImportData,
  setImportError,
  setImportLoading,
} = importSlice.actions;

export default importSlice.reducer;
