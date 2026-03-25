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

export const fetchAdminEvents = createAsyncThunk(
  "adminEvents/fetchAdminEvents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/events");
      const events = (data?.data || []).map((event) => ({
        id: event.E_ID,
        Description: event.Description,
        Event_Date: event.Event_Date,
        Organizer_ID: event.Organizer_ID,
        Organizer_Name: event.Organizer_Name,
        Added_On: event.Added_On,
        Poster_File: event.Poster_File,
        Interested: event.Interested || 0,
        Not_Interested: event.Not_Interested || 0,
        status: event.Is_Active,
      }));

      return { total: data?.total || events.length, items: events };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch admin events",
      );
    }
  },
);

export const moderateAdminEvent = createAsyncThunk(
  "adminEvents/moderateAdminEvent",
  async ({ action, id, reason }, { rejectWithValue }) => {
    try {
      await api.post("/admin/toggle-block", { type: "event", id, reason });
      return { action, id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update admin event",
      );
    }
  },
);

const adminEventsSlice = createSlice({
  name: "adminEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total = action.payload.total;
        state.items = action.payload.items;
      })
      .addCase(fetchAdminEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(moderateAdminEvent.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(moderateAdminEvent.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.map((event) =>
          event.id === action.payload.id
            ? {
                ...event,
                status: action.payload.action === "block" ? 0 : 1,
              }
            : event,
        );
      })
      .addCase(moderateAdminEvent.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      });
  },
});

export default adminEventsSlice.reducer;

export const selectAdminEvents = (state) => state.adminEvents.items;
export const selectAdminEventsActionStatus = (state) =>
  state.adminEvents.actionStatus;

export const selectAdminEventsStats = createSelector(
  (state) => state.adminEvents.total,
  selectAdminEvents,
  (total, events) => {
    const activeEvents = events.filter((event) => event.status === 1);
    const blockedEvents = events.filter((event) => event.status !== 1);
    const totalEvents = total || events.length;

    return [
      {
        title: "Total Events",
        value: totalEvents,
        infoText: `${activeEvents.length} active on feed`,
        color: "green",
        type: "total",
      },
      {
        title: "Active Events",
        value: activeEvents.length,
        infoText: `${totalEvents ? Math.round((activeEvents.length / totalEvents) * 100) : 0}% visible events`,
        color: "yellow",
        type: "pending",
      },
      {
        title: "Inactive Events",
        value: blockedEvents.length,
        infoText: `${blockedEvents.length} hidden from users`,
        color: "red",
        type: "blocked",
      },
    ];
  },
);
