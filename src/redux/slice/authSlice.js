import { createSlice } from "@reduxjs/toolkit";

const loginUserHelper = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

const getUserFromStorage = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

const removeUserFromStorage = () => {
  localStorage.removeItem("user");
};

const user = getUserFromStorage();

const initialState = {
  user: user, // user exists -> storage, load them -> Redux
  isAuthenticated: !!user, // user exists? true : false.
  loading: false,
  error: null,
};

// --- THE REDUX SLICE ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      loginUserHelper(action.payload); // Save to LocalStorage
    },
    // Call this action on Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeUserFromStorage(); // Clear LocalStorage
    },
    authError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { loginSuccess, logout, authError } = authSlice.actions;

// Export helpers if you need them outside (optional)
export const isLoggedIn = () => !!localStorage.getItem("user");

export default authSlice.reducer;
