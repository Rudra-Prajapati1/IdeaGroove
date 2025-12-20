import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const notesAdapter = createEntityAdapter({
  selectId: (note) => note.N_ID,
  sortComparer: (a, b) => new Date(b.Added_On) - new Date(a.Added_On),
});

const initialState = notesAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/collections/${
          import.meta.env.VITE_MOCKMAN_API_KEY
        }/693edcbeb6dbbbd14cf90d07/documents`
      );

      return data.map((d) => d.data);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch Notes.");
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        notesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  selectAll: selectAllNotes,
  selectById: selectNotesById,
  selectIds: selectNotesIds,
  selectEntities: selectNotesEntities,
} = notesAdapter.getSelectors((state) => state.notes);

export const selectNotesStatus = (state) => state.notes.status;
export const selectNotesError = (state) => state.notes.error;

export default notesSlice.reducer;
