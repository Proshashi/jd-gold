const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  loading: false,
  error: null,
  data: [],
};

const workerSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {
    setWorkerLoading(state, { payload }) {
      state.loading = payload;
    },
    setWorkerError(state, { payload }) {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { setWorkerError, setWorkerLoading } = workerSlice.actions;

export default workerSlice.reducer;
