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

  updateStatus: "idle",
  updateError: null,

  deleteStatus: "idle",
  deleteError: null,

  answerStatus: "idle",
  answerError: null,
};

/* ================= FETCH ALL QNA ================= */

export const fetchQnA = createAsyncThunk(
  "qna/fetchQnA",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      filter = "all",
      degree = "",
      subject = "",
    },
    { rejectWithValue },
  ) => {
    try {
      // Build query string — only include non-empty params
      const params = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(filter && filter !== "all" && { filter }),
        ...(degree && { degree }),
        ...(subject && { subject }),
      });

      const { data } = await api.get(`/qna?${params.toString()}`);
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

/* ================= UPDATE QUESTION ================= */

export const updateQuestion = createAsyncThunk(
  "qna/updateQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/qna/updateQuestion", payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update question",
      );
    }
  },
);

/* ================= DELETE QUESTION ================= */

export const deleteQuestion = createAsyncThunk(
  "qna/deleteQuestion",
  async (Q_ID, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/qna/deleteQuestion/${Q_ID}`);
      return { ...data, Q_ID };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete question",
      );
    }
  },
);

/* ================= CREATE ANSWER ================= */

export const createAnswer = createAsyncThunk(
  "qna/createAnswer",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/qna/createAnswer", payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to post answer",
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
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      /* ===== UPDATE QUESTION ===== */
      .addCase(updateQuestion.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateQuestion.fulfilled, (state) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      /* ===== DELETE QUESTION ===== */
      .addCase(deleteQuestion.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.data = state.data.filter((q) => q.Q_ID !== action.payload.Q_ID);
        state.previewQnA = state.previewQnA.filter(
          (q) => q.Q_ID !== action.payload.Q_ID,
        );
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      })

      /* ===== CREATE ANSWER ===== */
      .addCase(createAnswer.pending, (state) => {
        state.answerStatus = "loading";
        state.answerError = null;
      })
      .addCase(createAnswer.fulfilled, (state) => {
        state.answerStatus = "succeeded";
      })
      .addCase(createAnswer.rejected, (state, action) => {
        state.answerStatus = "failed";
        state.answerError = action.payload;
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

export const selectUpdateStatus = (state) => state.qna.updateStatus;
export const selectUpdateError = (state) => state.qna.updateError;

export const selectDeleteStatus = (state) => state.qna.deleteStatus;
export const selectDeleteError = (state) => state.qna.deleteError;

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

export const selectAnswerStatus = (state) => state.qna.answerStatus;
export const selectAnswerError = (state) => state.qna.answerError;
