import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const eventsAdapter = createEntityAdapter({
  selectId: (event) => event.E_ID,
  sortComparer: (a, b) => new Date(b.Event_Date) - new Date(a.Event_Date),
});

const initialState = eventsAdapter.getInitialState({
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,

  previewEvents: [],
  previewStatus: "idle",
  previewError: null,

  userEvents: [],
  userStatus: "idle",
  userError: null,

  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
});

/* ================= ALL EVENTS ================= */

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({ page = 1, limit = 9 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events?page=${page}&limit=${limit}`);
      return data; // must return { data, total, page, totalPages }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch events",
      );
    }
  },
);

/* ================= PREVIEW EVENTS ================= */

export const fetchPreviewEvents = createAsyncThunk(
  "events/fetchPreviewEvents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events?page=1&limit=3`);
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch preview events");
    }
  },
);

/* ================= USER EVENTS ================= */

export const fetchUserEvents = createAsyncThunk(
  "events/fetchUserEvents",
  async ({ userId, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/events/user/${userId}?page=${page}&limit=${limit}`,
      );
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch user events");
    }
  },
);

/* ================= CREATE EVENT ================= */

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/events/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data; // { status: true, message: ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create event",
      );
    }
  },
);

/* ================= UPDATE EVENT ================= */

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/events/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data; // { status: true, message: ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update event",
      );
    }
  },
);

/* ================= DELETE EVENT ================= */

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events/delete/${eventId}`);
      return { eventId, ...data }; // Return eventId so we can remove it locally if needed
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete event",
      );
    }
  },
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ===== ALL EVENTS ===== */
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;

        eventsAdapter.setAll(state, action.payload.data);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ===== PREVIEW ===== */
      .addCase(fetchPreviewEvents.pending, (state) => {
        state.previewStatus = "loading";
        state.previewError = null;
      })
      .addCase(fetchPreviewEvents.fulfilled, (state, action) => {
        state.previewStatus = "succeeded";
        state.previewEvents = action.payload.data;
      })
      .addCase(fetchPreviewEvents.rejected, (state, action) => {
        state.previewStatus = "failed";
        state.previewError = action.payload;
      })

      /* ===== USER EVENTS ===== */
      .addCase(fetchUserEvents.pending, (state) => {
        state.userStatus = "loading";
        state.userError = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        state.userEvents = action.payload.data;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.userStatus = "failed";
        state.userError = action.payload;
      })

      /* ===== CREATE EVENT ===== */
      .addCase(createEvent.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        // No addOne since no data returned; parent will refetch
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      /* ===== UPDATE EVENT ===== */
      .addCase(updateEvent.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        // No upsert since no data returned; parent will refetch
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })
      /* ===== DELETE EVENT ===== */
      .addCase(deleteEvent.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        // Optional: remove from state immediately (optimistic update)
        eventsAdapter.removeOne(state, action.payload.eventId);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });
  },
});

export default eventsSlice.reducer;

/* ================= SELECTORS ================= */

export const { selectAll: selectAllEvents, selectById: selectEventById } =
  eventsAdapter.getSelectors((state) => state.events);

export const selectEventsStatus = (state) => state.events.status;
export const selectEventsError = (state) => state.events.error;

export const selectEventsPagination = createSelector(
  (state) => state.events.page,
  (state) => state.events.totalPages,
  (state) => state.events.total,
  (page, totalPages, total) => ({ page, totalPages, total }),
);

export const selectPreviewEvents = (state) => state.events.previewEvents;

export const selectPreviewStatus = (state) => state.events.previewStatus;

export const selectPreviewError = (state) => state.events.previewError;

export const selectUserEvents = (state) => state.events.userEvents;

export const selectUserEventsStatus = (state) => state.events.userStatus;

export const selectUserEventsError = (state) => state.events.userError;
export const selectDeleteStatus = (state) => state.events.deleteStatus;
export const selectDeleteError = (state) => state.events.deleteError;
