const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  loading: false,
  error: null,
  cash: 0,
};

const cashBookSlice = createSlice({
  name: "cashBook",
  initialState,
  reducers: {
    setCashBookError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
    setCashBookLoading(state, { payload }) {
      state.loading = payload;
    },
    setCashBookCash(state, { payload }) {
      state.cash = payload;
    },
  },
});

export const {
  setCashBookCash,
  setCashBookError,
  setCashBookLoading,
} = cashBookSlice.actions;

export default cashBookSlice.reducer;
