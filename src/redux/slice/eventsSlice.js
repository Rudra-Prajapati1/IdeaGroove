import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
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
});

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({ page = 1, limit = 9 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events?page=${page}&limit=${limit}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch events",
      );
    }
  },
);

export const fetchPreviewEvents = createAsyncThunk(
  "events/fetchPreviewEvents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events?limit=3&page=1`);
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch preview events");
    }
  },
);

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

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ALL EVENTS */
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

      /* PREVIEW */
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

      /* USER EVENTS */
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
      });
  },
});

export default eventsSlice.reducer;

export const { selectAll: selectAllEvents, selectById: selectEventById } =
  eventsAdapter.getSelectors((state) => state.events);

export const selectUserEvents = (state) => state.events.userEvents;
export const selectEventsStatus = (state) => state.events.status;
export const selectUserEventsStatus = (state) => state.events.userStatus;
export const selectEventsPagination = (state) => ({
  page: state.events.page,
  totalPages: state.events.totalPages,
});
export const selectPreviewEvents = (state) => state.events.previewEvents;
export const selectPreviewStatus = (state) => state.events.previewStatus;
export const selectPreviewError = (state) => state.events.previewError;
export const selectEventsError = (state) => state.events.error;
