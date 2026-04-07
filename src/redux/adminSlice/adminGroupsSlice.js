import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  items: [],
  total: 0,
  status: "idle",
  error: null,
  actionStatus: "idle",
  actionError: null,
};

export const fetchAdminGroups = createAsyncThunk(
  "adminGroups/fetchAdminGroups",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/groups");
      const groups = (data?.data || []).map((group) => ({
        id: group.Room_ID,
        Name: group.Room_Name,
        Based_On: group.Hobby_Name,
        Based_On_id: group.Based_On,
        Creator_ID: group.Creator_ID,
        Creator_Name: group.Creator_Name,
        Created_On: group.Created_On,
        Member_Count: group.Member_Count,
        Description: group.Description,
        status: Number(group.Is_Active) === 1 ? "active" : "blocked",
      }));

      return { total: data?.pagination?.total || groups.length, items: groups };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch admin groups",
      );
    }
  },
);

export const moderateAdminGroup = createAsyncThunk(
  "adminGroups/moderateAdminGroup",
  async ({ action, id, reason }, { rejectWithValue }) => {
    try {
      await api.post("/admin/toggle-block", { type: "group", id, reason });
      return { action, id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update admin group",
      );
    }
  },
);

const adminGroupsSlice = createSlice({
  name: "adminGroups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminGroups.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total = action.payload.total;
        state.items = action.payload.items;
      })
      .addCase(fetchAdminGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(moderateAdminGroup.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(moderateAdminGroup.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.map((group) =>
          group.id === action.payload.id
            ? {
                ...group,
                status: action.payload.action === "block" ? "blocked" : "active",
              }
            : group,
        );
      })
      .addCase(moderateAdminGroup.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      });
  },
});

export default adminGroupsSlice.reducer;

export const selectAdminGroups = (state) => state.adminGroups.items;
export const selectAdminGroupsActionStatus = (state) =>
  state.adminGroups.actionStatus;

export const selectAdminGroupsStats = createSelector(
  (state) => state.adminGroups.total,
  selectAdminGroups,
  (total, groups) => {
    const activeGroups = groups.filter((group) => group.status === "active");
    const blockedGroups = groups.filter((group) => group.status === "blocked");
    const totalGroups = total || groups.length;

    return [
      {
        title: "Total Groups",
        value: totalGroups,
        infoText: `${activeGroups.length} active communities`,
        color: "green",
        type: "total",
      },
      {
        title: "Active Groups",
        value: activeGroups.length,
        infoText: `${totalGroups ? Math.round((activeGroups.length / totalGroups) * 100) : 0}% currently active`,
        color: "yellow",
        type: "pending",
      },
      {
        title: "Inactive Groups",
        value: blockedGroups.length,
        infoText: `${blockedGroups.length} blocked or archived`,
        color: "red",
        type: "blocked",
      },
    ];
  },
);
