// src/redux/slice/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios"; // Use the configured api
import toast from "react-hot-toast";

const SESSION_RETRY_DELAYS_MS = [0, 1500, 3500];

const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const storedUser = getUserFromStorage();
const isStoredAdmin = storedUser?.role === "admin";
const hasStoredUserSession = !!storedUser && !isStoredAdmin;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getRestoreSessionFailure = (err) => {
  const status = err.response?.status ?? null;

  return {
    status,
    message: err.response?.data?.message || "Failed to restore session.",
    shouldClearAuth: status === 401 || status === 403,
  };
};

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    for (let attempt = 0; attempt < SESSION_RETRY_DELAYS_MS.length; attempt++) {
      try {
        if (SESSION_RETRY_DELAYS_MS[attempt] > 0) {
          await wait(SESSION_RETRY_DELAYS_MS[attempt]);
        }

        const res = await api.get("/auth/session");
        return res.data.user;
      } catch (err) {
        const failure = getRestoreSessionFailure(err);
        const shouldRetry =
          !failure.shouldClearAuth &&
          attempt < SESSION_RETRY_DELAYS_MS.length - 1 &&
          (!failure.status || failure.status >= 500);

        if (shouldRetry) {
          continue;
        }

        return rejectWithValue(failure);
      }
    }
  },
);

const initialState = {
  user: storedUser,
  isAuthenticated: hasStoredUserSession,
  sessionChecked: isStoredAdmin || !hasStoredUserSession,
  sessionLoading: false,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  resetLinkSent: false,
};

// ─── Async Thunks ────────────────────────────────────────────────

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Signup failed.",
      );
    }
  },
);

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/sendOTP", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to send OTP");
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ otp, token }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/verifyOTP", { otp, token });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Invalid or expired OTP",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset link",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionChecked = true;
      state.sessionLoading = false;
      state.loading = false;
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.resetLinkSent = false;
      localStorage.removeItem("user");
      // toast.success("Logged out successfully");
    },
    expireSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionChecked = true;
      state.sessionLoading = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthUser: (state, action) => {
      state.user = action.payload || null;
      state.isAuthenticated =
        !!action.payload && action.payload.role !== "admin";
      state.sessionChecked = true;
      state.sessionLoading = false;
      state.loading = false;
      state.error = null;

      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    updateUserInAuth: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(restoreSession.pending, (state) => {
        state.sessionLoading = true;
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.sessionLoading = false;
        state.sessionChecked = true;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(restoreSession.rejected, (state, action) => {
        const shouldClearAuth = action.payload?.shouldClearAuth ?? false;
        state.sessionLoading = false;
        state.sessionChecked = true;
        state.error = shouldClearAuth ? action.payload?.message || null : null;

        if (shouldClearAuth) {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("user");
          return;
        }

        state.isAuthenticated = !!state.user && state.user.role !== "admin";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.sessionChecked = true;
        state.sessionLoading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Login successful!");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.sessionChecked = true;
        state.sessionLoading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success("Account created successfully!");
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        toast.success("OTP sent to your email!");
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
        toast.success("OTP verified!");
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetLinkSent = true;
        toast.success("Password reset link sent!");
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const {
  logout,
  expireSession,
  clearAuthError,
  setAuthUser,
  updateUserInAuth,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthSessionChecked = (state) => state.auth.sessionChecked;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
