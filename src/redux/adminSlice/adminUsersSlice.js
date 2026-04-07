import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { formatAcademicYear } from "./adminHelpers";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  actionStatus: "idle",
  actionError: null,
};

export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetchAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/users");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch admin users",
      );
    }
  },
);

export const moderateAdminUser = createAsyncThunk(
  "adminUsers/moderateAdminUser",
  async ({ action, id, reason }, { rejectWithValue }) => {
    try {
      const endpoint =
        action === "block" ? "/admin/block-student" : "/admin/unblock-student";
      await api.post(endpoint, { id, reason });
      return { action, id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update admin user",
      );
    }
  },
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(moderateAdminUser.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(moderateAdminUser.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.map((user) =>
          user.S_ID === action.payload.id
            ? {
                ...user,
                is_Active: action.payload.action === "block" ? 0 : 1,
              }
            : user,
        );
      })
      .addCase(moderateAdminUser.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      });
  },
});

export default adminUsersSlice.reducer;

export const selectAdminUsers = (state) => state.adminUsers.items;
export const selectAdminUsersActionStatus = (state) =>
  state.adminUsers.actionStatus;

export const selectAdminUserYearOptions = createSelector(
  selectAdminUsers,
  (users) =>
    [...new Set(users.map((user) => formatAcademicYear(user?.Year)).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b),
    ),
);

export const selectAdminUserStats = createSelector(selectAdminUsers, (users) => {
  const activeCount = users.filter((user) => Number(user?.is_Active) === 1).length;
  const inactiveCount = users.filter((user) => Number(user?.is_Active) !== 1).length;
  const degreeCount = new Set(
    users
      .map((user) => user?.Degree?.Degree_Name || user?.Degree_Name)
      .filter(Boolean),
  ).size;

  return [
    {
      title: "Total Users",
      value: users.length,
      infoText: `${degreeCount} degree groups`,
      color: "green",
      type: "total",
    },
    {
      title: "Active Users",
      value: activeCount,
      infoText: `${users.length ? Math.round((activeCount / users.length) * 100) : 0}% of all users`,
      color: "yellow",
      type: "pending",
    },
    {
      title: "Inactive Users",
      value: inactiveCount,
      infoText: `${inactiveCount} need review`,
      color: "red",
      type: "blocked",
    },
  ];
});
