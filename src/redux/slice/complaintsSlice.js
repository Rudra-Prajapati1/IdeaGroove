import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ================= FETCH USER COMPLAINTS ================= */

export const fetchUserComplaints = createAsyncThunk(
  "complaints/fetchUserComplaints",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/complaints/user/${userId}?page=${page}&limit=${limit}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch complaints"
      );
    }
  }
);

/* ================= CREATE COMPLAINT ================= */

export const createComplaint = createAsyncThunk(
  "complaints/createComplaint",
  async (complaintData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/complaints/create", complaintData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to submit complaint"
      );
    }
  }
);

/* ================= FETCH CONTENT OPTIONS ================= */

export const fetchContentOptions = createAsyncThunk(
  "complaints/fetchContentOptions",
  async (category, { rejectWithValue }) => {
    try {
      let response;

      switch (category) {
        case "Notes":
          response = await api.get("/notes?limit=100");
          return (response.data.notes || []).map((note) => ({
            id: note.N_ID,
            label: `${note.File_Name}|${note.Author}`,
          }));

        case "Events":
          response = await api.get("/events?limit=100");
          return (response.data.data || []).map((event) => ({
            id: event.E_ID,
            label: `${event.Description}|${event.Organizer_Name}`,
          }));

        case "Groups":
          response = await api.get("/groups?limit=100");
          return (response.data.data || []).map((group) => ({
            id: group.Room_ID,
            label: `${group.Room_Name}|${group.Creator_Name}`,
          }));

        case "QnA":
          response = await api.get("/qna?limit=100");
          return (response.data.QnA || []).map((q) => ({
            id: q.Q_ID,
            label: `${q.Question}|${q.Question_Author}`,
          }));

        case "User":
          response = await api.get("/students/all");
          return (response.data || []).map((user) => ({
            id: user.S_ID,
            label: `@${user.Username}`,
          }));

        default:
          return [];
      }
    } catch (err) {
      return rejectWithValue("Failed to fetch content options");
    }
  }
);

/* ================= FETCH ANSWERS FOR QUESTION ================= */

export const fetchAnswersByQuestion = createAsyncThunk(
  "complaints/fetchAnswersByQuestion",
  async (questionId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/qna/answers/${questionId}`);
      return data.answers || [];
    } catch (err) {
      return rejectWithValue("Failed to fetch answers");
    }
  }
);



export const deleteComplaintThunk = createAsyncThunk(
  "complaints/deleteComplaint",
  async (complaintId, { rejectWithValue }) => {
    try {
      await api.delete(`/complaints/delete/${complaintId}`);
      return complaintId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete complaint"
      );
    }
  }
);
/* ================= INITIAL STATE ================= */

const initialState = {
  complaints: [],
  status: "idle",
  error: null,

  contentOptions: [],
  contentStatus: "idle",

  answersOptions: [],
  answersStatus: "idle",
};

/* ================= SLICE ================= */

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH USER COMPLAINTS */
      .addCase(fetchUserComplaints.fulfilled, (state, action) => {
        state.complaints = action.payload.data || [];
      })

      /* FETCH CONTENT */
      .addCase(fetchContentOptions.pending, (state) => {
        state.contentStatus = "loading";
      })
      .addCase(fetchContentOptions.fulfilled, (state, action) => {
        state.contentStatus = "succeeded";
        state.contentOptions = action.payload || [];
      })

      /* FETCH ANSWERS */
      .addCase(fetchAnswersByQuestion.pending, (state) => {
        state.answersStatus = "loading";
      })

      .addCase(deleteComplaintThunk.fulfilled, (state, action) => {
  state.complaints = state.complaints.filter(
    (item) => item.Complaint_ID !== action.payload
  );
})

      .addCase(fetchAnswersByQuestion.fulfilled, (state, action) => {
        state.answersStatus = "succeeded";
        state.answersOptions = action.payload.map((a) => ({
          id: a.A_ID,
          label: `"${a.Answer}" by "${a.Answer_Author}"`,
        }));
      });
  },
});

export default complaintsSlice.reducer;