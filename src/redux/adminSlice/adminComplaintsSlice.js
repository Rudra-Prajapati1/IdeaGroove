import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  items: [],
  summary: {
    totalCount: 0,
    activeCount: 0,
    inactiveCount: 0,
  },
  status: "idle",
  error: null,
  actionStatus: "idle",
  actionError: null,
};

export const fetchAdminComplaints = createAsyncThunk(
  "adminComplaints/fetchAdminComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/complaints", {
        params: { page: 1, limit: 500 },
      });
      return {
        items: Array.isArray(data?.data) ? data.data : [],
        summary: {
          totalCount: Number(data?.summary?.totalCount || 0),
          activeCount: Number(data?.summary?.activeCount || 0),
          inactiveCount: Number(data?.summary?.inactiveCount || 0),
        },
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch admin complaints",
      );
    }
  },
);

export const updateAdminComplaintStatus = createAsyncThunk(
  "adminComplaints/updateAdminComplaintStatus",
  async ({ id, status, reason }, { rejectWithValue }) => {
    try {
      await api.post("/complaints/update-status", { id, status, reason });
      return { id, status };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update complaint status",
      );
    }
  },
);

const adminComplaintsSlice = createSlice({
  name: "adminComplaints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminComplaints.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminComplaints.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.summary = action.payload.summary;
      })
      .addCase(fetchAdminComplaints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateAdminComplaintStatus.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(updateAdminComplaintStatus.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.map((complaint) =>
          complaint.Complaint_ID === action.payload.id
            ? { ...complaint, Status: action.payload.status }
            : complaint,
        );
      })
      .addCase(updateAdminComplaintStatus.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      });
  },
});

export default adminComplaintsSlice.reducer;

export const selectAdminComplaints = (state) => state.adminComplaints.items;
export const selectAdminComplaintsActionStatus = (state) =>
  state.adminComplaints.actionStatus;
export const selectAdminComplaintsSummary = (state) =>
  state.adminComplaints.summary;

export const selectAdminComplaintsStats = createSelector(
  selectAdminComplaints,
  selectAdminComplaintsSummary,
  (complaints, summary) => {
    const totalCount = summary?.totalCount || complaints.length;
    const activeCount = summary?.activeCount || complaints.length;
    const inactiveCount = summary?.inactiveCount || 0;

    return [
      {
        title: "Total Complaints",
        value: totalCount,
        infoText: `${activeCount} currently active`,
        color: "green",
        type: "total",
      },
      {
        title: "Active Complaints",
        value: activeCount,
        infoText: `${totalCount ? Math.round((activeCount / totalCount) * 100) : 0}% of all complaints`,
        color: "yellow",
        type: "pending",
      },
      {
        title: "Inactive Complaints",
        value: inactiveCount,
        infoText: `${inactiveCount} removed from the active list`,
        color: "red",
        type: "blocked",
      },
    ];
  },
);
