import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  statsData: {},
  contributorData: [],
  recentActivities: [],
  status: "idle",
  error: null,
};

export const fetchAdminOverview = createAsyncThunk(
  "adminOverview/fetchAdminOverview",
  async (_, { rejectWithValue }) => {
    try {
      const [statsRes, contributorRes, recentRes] = await Promise.all([
        api.get("/admin/dashboard-stats"),
        api.get("/admin/top-contributor"),
        api.get("/admin/recent-activity"),
      ]);

      return {
        statsData: statsRes.data || {},
        contributorData: contributorRes.data || [],
        recentActivities: recentRes.data || [],
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch admin overview",
      );
    }
  },
);

const adminOverviewSlice = createSlice({
  name: "adminOverview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOverview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.statsData = action.payload.statsData;
        state.contributorData = action.payload.contributorData;
        state.recentActivities = action.payload.recentActivities;
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default adminOverviewSlice.reducer;

export const selectAdminDashboardStatsData = (state) =>
  state.adminOverview.statsData;
export const selectAdminTopContributors = (state) =>
  state.adminOverview.contributorData;
export const selectAdminRecentActivities = (state) =>
  state.adminOverview.recentActivities;

export const selectAdminDashboardCategories = createSelector(
  selectAdminDashboardStatsData,
  (statsData) => {
    const totalUploads =
      (statsData?.totalNotes || 0) +
      (statsData?.totalQuestions || 0) +
      (statsData?.upcomingEvents || 0) +
      (statsData?.activeGroups || 0);

    return [
      { name: "Notes", count: statsData?.totalNotes || 0 },
      { name: "Questions", count: statsData?.totalQuestions || 0 },
      { name: "Events", count: statsData?.upcomingEvents || 0 },
      { name: "Groups", count: statsData?.activeGroups || 0 },
    ].map((item) => ({
      ...item,
      percentage:
        totalUploads > 0 ? Math.round((item.count / totalUploads) * 100) : 0,
      color:
        item.name === "Notes"
          ? "bg-rose-600"
          : item.name === "Questions"
            ? "bg-[#25eb63]"
            : item.name === "Events"
              ? "bg-amber-500"
              : "bg-purple-600",
    }));
  },
);
