import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const notesAdapter = createEntityAdapter({
  selectId: (note) => note.N_ID,
  sortComparer: (a, b) => new Date(b.Added_on) - new Date(a.Added_on),
});

const initialState = notesAdapter.getInitialState({
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,

  previewNotes: [],
  previewStatus: "idle",
  previewError: null,

  userNotes: [],
  userStatus: "idle",
  userError: null,

  createStatus: "idle",
  createError: null,

  updateStatus: "idle",
  updateError: null,

  deleteStatus: "idle",
  deleteError: null,
});

/* ================= ALL NOTES ================= */

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (
    {
      page = 1,
      limit = 9,
      search = "",
      filter = "all",
      degree = "",
      subject = "",
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(filter && filter !== "all" && { filter }),
        ...(degree && { degree }),
        ...(subject && { subject }),
      });
      const { data } = await api.get(`/notes?${params.toString()}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch notes",
      );
    }
  },
);

/* ================= CREATE NOTE ================= */

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/notes/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to upload note",
      );
    }
  },
);

/* ================= UPDATE NOTE ================= */

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/notes/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update note",
      );
    }
  },
);

/* ================= DELETE NOTE ================= */

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (N_ID, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/notes/delete/${N_ID}`);
      return { ...data, N_ID };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete note",
      );
    }
  },
);

/* ================= PREVIEW NOTES ================= */

export const fetchPreviewNotes = createAsyncThunk(
  "notes/fetchPreviewNotes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/notes?page=1&limit=3`);
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch preview notes");
    }
  },
);

/* ================= USER NOTES ================= */

export const fetchUserNotes = createAsyncThunk(
  "notes/fetchUserNotes",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/notes/user/${userId}?page=${page}&limit=${limit}`,
      );
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch user notes");
    }
  },
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ALL */
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
        notesAdapter.setAll(state, action.payload.notes);
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createNote.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createNote.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createNote.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      /* UPDATE */
      .addCase(updateNote.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateNote.fulfilled, (state) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      /* DELETE */
      .addCase(deleteNote.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        notesAdapter.removeOne(state, action.payload.N_ID);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      })

      /* PREVIEW */
      .addCase(fetchPreviewNotes.pending, (state) => {
        state.previewStatus = "loading";
        state.previewError = null;
      })
      .addCase(fetchPreviewNotes.fulfilled, (state, action) => {
        state.previewStatus = "succeeded";
        state.previewNotes = action.payload.notes;
      })
      .addCase(fetchPreviewNotes.rejected, (state, action) => {
        state.previewStatus = "failed";
        state.previewError = action.payload;
      })

      /* USER */
      .addCase(fetchUserNotes.pending, (state) => {
        state.userStatus = "loading";
        state.userError = null;
      })
      .addCase(fetchUserNotes.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        state.userNotes = action.payload.notes;
      })
      .addCase(fetchUserNotes.rejected, (state, action) => {
        state.userStatus = "failed";
        state.userError = action.payload;
      });
  },
});

export default notesSlice.reducer;

/* ================= SELECTORS ================= */

export const { selectAll: selectAllNotes, selectById: selectNotesById } =
  notesAdapter.getSelectors((state) => state.notes);

export const selectNotesStatus = (state) => state.notes.status;
export const selectNotesError = (state) => state.notes.error;

export const selectCreateNoteStatus = (state) => state.notes.createStatus;
export const selectUpdateNoteStatus = (state) => state.notes.updateStatus;
export const selectDeleteNoteStatus = (state) => state.notes.deleteStatus;

export const selectNotesPagination = createSelector(
  (state) => state.notes.page,
  (state) => state.notes.totalPages,
  (state) => state.notes.total,
  (page, totalPages, total) => ({ page, totalPages, total }),
);

export const selectPreviewNotes = (state) => state.notes.previewNotes;
export const selectPreviewNotesStatus = (state) => state.notes.previewStatus;
export const selectPreviewNotesError = (state) => state.notes.previewError;

export const selectUserNotes = (state) => state.notes.userNotes;
export const selectUserNotesStatus = (state) => state.notes.userStatus;
export const selectUserNotesError = (state) => state.notes.userError;
