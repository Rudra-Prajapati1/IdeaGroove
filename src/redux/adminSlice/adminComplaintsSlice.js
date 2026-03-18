import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { normalizeArrayResponse } from "./adminHelpers";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  actionStatus: "idle",
  actionError: null,
};

export const fetchAdminComplaints = createAsyncThunk(
  "adminComplaints/fetchAdminComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/complaints");
      return normalizeArrayResponse(data, ["complaints", "data"]);
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
        state.items = action.payload;
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

export const selectAdminComplaintsStats = createSelector(
  selectAdminComplaints,
  (complaints) => {
    const resolvedCount = complaints.filter(
      (complaint) => complaint.Status === "Resolved",
    ).length;
    const pendingCount = complaints.filter(
      (complaint) =>
        complaint.Status === "Pending" || complaint.Status === "In-Progress",
    ).length;

    return [
      {
        title: "Total Complaints",
        value: complaints.length,
        infoText: `${pendingCount} awaiting action`,
        color: "green",
        type: "total",
      },
      {
        title: "Resolved",
        value: resolvedCount,
        infoText: `${complaints.length ? Math.round((resolvedCount / complaints.length) * 100) : 0}% resolution rate`,
        color: "yellow",
        type: "pending",
      },
      {
        title: "Pending",
        value: pendingCount,
        infoText: `${pendingCount} open complaints`,
        color: "red",
        type: "blocked",
      },
    ];
  },
);
