import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  authError: null,
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setAuthLoading(state, { payload }) {
      state.loading = payload;
    },
    setAuthError(state, { payload }) {
      state.authError = payload;
      state.loading = false;
    },
  },
});

export default authSlice.reducer;

export const { setAuthError, setAuthLoading } = authSlice.actions;
