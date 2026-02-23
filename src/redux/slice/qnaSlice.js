import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  data: [],
  status: "idle",
  error: null,
  page: 1,
  totalPages: 1,
  total: 0,

  previewQnA: [],
  previewStatus: "idle",
  previewError: null,

  userQuestions: [],
  userStatus: "idle",
  userError: null,

  createStatus: "idle",
  createError: null,
};

/* ================= FETCH ALL QNA ================= */

export const fetchQnA = createAsyncThunk(
  "qna/fetchQnA",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/qna?page=${page}&limit=${limit}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch QnA",
      );
    }
  },
);

/* ================= CREATE QUESTION ================= */

export const createQuestion = createAsyncThunk(
  "qna/createQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/qna/createQuestion", payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create question",
      );
    }
  },
);

/* ================= PREVIEW ================= */

export const fetchPreviewQnA = createAsyncThunk(
  "qna/fetchPreviewQnA",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/qna?page=1&limit=3`);
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch preview QnA");
    }
  },
);

/* ================= USER QUESTIONS ================= */

export const fetchUserQuestions = createAsyncThunk(
  "qna/fetchUserQuestions",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/qna/userQuestions/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue("Failed to fetch user questions");
    }
  },
);

const qnaSlice = createSlice({
  name: "qna",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ===== FETCH ALL ===== */
      .addCase(fetchQnA.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQnA.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.QnA;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
      })
      .addCase(fetchQnA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ===== CREATE QUESTION ===== */
      .addCase(createQuestion.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createQuestion.fulfilled, (state) => {
        state.createStatus = "succeeded";
        // IMPORTANT:
        // we DO NOT push new question manually
        // because backend returns JOIN rows
        // we will refetch instead
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      /* ===== PREVIEW ===== */
      .addCase(fetchPreviewQnA.pending, (state) => {
        state.previewStatus = "loading";
      })
      .addCase(fetchPreviewQnA.fulfilled, (state, action) => {
        state.previewStatus = "succeeded";
        state.previewQnA = action.payload.QnA;
      })
      .addCase(fetchPreviewQnA.rejected, (state, action) => {
        state.previewStatus = "failed";
        state.previewError = action.payload;
      })

      /* ===== USER ===== */
      .addCase(fetchUserQuestions.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(fetchUserQuestions.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        state.userQuestions = action.payload.data;
      })
      .addCase(fetchUserQuestions.rejected, (state, action) => {
        state.userStatus = "failed";
        state.userError = action.payload;
      });
  },
});

export default qnaSlice.reducer;

/* ================= SELECTORS ================= */

export const selectAllQnA = (state) => state.qna.data;
export const selectQnAStatus = (state) => state.qna.status;
export const selectQnAError = (state) => state.qna.error;

export const selectCreateStatus = (state) => state.qna.createStatus;
export const selectCreateError = (state) => state.qna.createError;

export const selectQnAPagination = createSelector(
  (state) => state.qna.page,
  (state) => state.qna.totalPages,
  (state) => state.qna.total,
  (page, totalPages, total) => ({ page, totalPages, total }),
);

export const selectPreviewQnA = (state) => state.qna.previewQnA;
export const selectPreviewQnAStatus = (state) => state.qna.previewStatus;
export const selectPreviewQnAError = (state) => state.qna.previewError;

export const selectUserQuestions = (state) => state.qna.userQuestions;
export const selectUserQuestionsStatus = (state) => state.qna.userStatus;
export const selectUserQuestionsError = (state) => state.qna.userError;
