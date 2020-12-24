const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  loading: false,
  error: null,
};

const dailyExpansesSlice = createSlice({
  name: "dailyExpanses",
  initialState,
  reducers: {
    setDailyExpansesLoading(state, { payload }) {
      state.loading = payload;
    },
    setDailyExpansesError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const {
  setDailyExpansesError,
  setDailyExpansesLoading,
} = dailyExpansesSlice.actions;

export default dailyExpansesSlice.reducer;
