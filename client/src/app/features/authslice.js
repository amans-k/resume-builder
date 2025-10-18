// authslice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token"),
    user: null,
    isLoading: true,
    isInitialized: false,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoading = false;
      state.isInitialized = true;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoading = false;
      state.isInitialized = true;
      localStorage.removeItem("token");
    },
    setLoading: (state, action) => {  // ✅ Make sure this exists
      state.isLoading = action.payload;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
      state.isLoading = false;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
});

// ✅ Make sure setLoading is exported
export const { login, logout, setLoading, setInitialized, updateUser } = authSlice.actions;
export default authSlice.reducer;