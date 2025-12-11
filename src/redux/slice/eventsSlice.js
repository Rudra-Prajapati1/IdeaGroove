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
});

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/collections/${
          import.meta.env.VITE_MOCKMAN_API_KEY
        }/6939538eb6dbbbd14cf90439/documents`
      );

      return data.map((d) => d.data);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch events");
    }
  }
);

export const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        eventsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  selectAll: selectAllEvents,
  selectById: selectEventById,
  selectIds: selectEventIds,
  selectEntities: selectEventEntities,
} = eventsAdapter.getSelectors((state) => state.events);

export const selectEventsStatus = (state) => state.events.status;
export const selectEventsError = (state) => state.events.error;

export default eventSlice.reducer;
