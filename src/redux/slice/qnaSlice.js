import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
};

/* ================= ALL QNA ================= */

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

      /* ALL */
      .addCase(fetchQnA.pending, (state) => {
        state.status = "loading";
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

      /* PREVIEW */
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

      /* USER */
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

export const selectQnAPagination = (state) => ({
  page: state.qna.page,
  totalPages: state.qna.totalPages,
});

export const selectPreviewQnA = (state) => state.qna.previewQnA;
export const selectPreviewStatus = (state) => state.qna.previewStatus;
export const selectPreviewError = (state) => state.qna.previewError;

export const selectUserQuestions = (state) => state.qna.userQuestions;
export const selectUserStatus = (state) => state.qna.userStatus;
