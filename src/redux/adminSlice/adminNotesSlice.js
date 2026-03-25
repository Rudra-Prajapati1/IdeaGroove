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

export const fetchAdminNotes = createAsyncThunk(
  "adminNotes/fetchAdminNotes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/notes?page=1&limit=50");
      return {
        total: data?.total || 0,
        items: (data?.notes || []).map((note) => ({
          id: note.N_ID,
          title: note.Description,
          description: note.Description,
          degree: note.Degree_Name,
          subject: note.Subject_Name,
          uploadedBy: note.Author,
          userId: note.Author_ID,
          file: note.File_Name || note.Note_File,
          noteFile: note.Note_File,
          status: note.Is_Active === 1 ? "active" : "blocked",
        })),
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch admin notes",
      );
    }
  },
);

export const moderateAdminNote = createAsyncThunk(
  "adminNotes/moderateAdminNote",
  async ({ action, id, reason }, { rejectWithValue }) => {
    try {
      await api.post("/admin/toggle-block", { type: "note", id, reason });
      return { action, id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update admin note",
      );
    }
  },
);

const adminNotesSlice = createSlice({
  name: "adminNotes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminNotes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminNotes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total = action.payload.total;
        state.items = action.payload.items;
      })
      .addCase(fetchAdminNotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(moderateAdminNote.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(moderateAdminNote.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.items = state.items.map((note) =>
          note.id === action.payload.id
            ? {
                ...note,
                status: action.payload.action === "block" ? "blocked" : "active",
              }
            : note,
        );
      })
      .addCase(moderateAdminNote.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      });
  },
});

export default adminNotesSlice.reducer;

export const selectAdminNotes = (state) => state.adminNotes.items;
export const selectAdminNotesActionStatus = (state) =>
  state.adminNotes.actionStatus;

export const selectAdminNotesStats = createSelector(
  (state) => state.adminNotes.total,
  selectAdminNotes,
  (total, notes) => {
    const activeNotes = notes.filter((note) => note.status === "active");
    const blockedNotes = notes.filter((note) => note.status === "blocked");
    const totalNotes = total || notes.length;

    return [
      {
        title: "Total Notes Uploaded",
        value: totalNotes,
        infoText: `${activeNotes.length} active right now`,
        color: "green",
        type: "total",
      },
      {
        title: "Active Notes",
        value: activeNotes.length,
        infoText: `${totalNotes ? Math.round((activeNotes.length / totalNotes) * 100) : 0}% of total notes`,
        color: "yellow",
        type: "pending",
      },
      {
        title: "Inactive Notes",
        value: blockedNotes.length,
        infoText: `${blockedNotes.length} blocked or removed`,
        color: "red",
        type: "blocked",
      },
    ];
  },
);
